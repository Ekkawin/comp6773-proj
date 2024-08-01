from machine import Timer, Pin, I2C
from ubluepy import Service, Characteristic, UUID, Peripheral,constants
from board import LED
import time
import lps22h
import hs3003
import struct
import imu


bus = I2C(1, scl=Pin(15), sda=Pin(14))
hs = hs3003.HS3003(bus)
lps = lps22h.LPS22H(bus)
imu = imu.IMU(bus)

led_red = LED(1)
led_green = LED(3)
led_blue = LED(2)
led_builtin = LED(4)

red_on = False
blue_on = False
green_on = False

red_timer_start = False
blue_timer_start = False
green_timer_start = False
temps = []
press = []
imus = []


#Task3

def get_sensor_data(t):
    global press
    global temps
    global imus
    pressure = "Press:%.2f hPa" %(lps.pressure())
    if len(press) > 5 :
        press.pop(0)
    press.append(pressure)
    temperature = "Temp:%.2f C" %(lps.temperature())
    if len(temps) > 5 :
        temps.pop(0)
    temps.append(temperature)
    _imu = "x:{:>1.2f} y:{:>1.1f} z:{:>1.1f}".format(*imu.accel())
    if len(imus) > 5 :
        imus.pop(0)
    imus.append(_imu)
   
def notify_master(t):
    global notif_enabled
    global custom_read_char
    global press
    global data_type
    global press
    global temps
    global imus
    print("notif_enabled", notif_enabled)
    if notif_enabled:
        if data_type == 'p':
         print(press[0])
         custom_read_char.write(press[0])
        elif data_type == 't':
         custom_read_char.write(temps[0])
        else:
         custom_read_char.write(imus[0])
"""  
def imu_function(t):
    global imus
    _imu = "x:{:>1.2f} y:{:>1.1f} z:{:>1.1f}".format(*imu.accel())
    if len(imus) > 5 :
        imus.pop(0)
    imus.append(_imu)
"""
    
def event_handler(id, handle, data):
    global periph
    global services
    global custom_read_char
    global notif_enabled
    global press
    global temps
    global imus
    global data_type
    
    print("id", id)
    print("handle", handle)
    if id == constants.EVT_GAP_CONNECTED:
        pass
    elif id == constants.EVT_GAP_DISCONNECTED:
        # restart advertisement
        notif_enabled = False
        periph.advertise(device_name="Ed 33 BLE Sense")
    elif id == constants.EVT_GATTS_WRITE:
        if handle == 16: # custom_wrt_char
            print(data)
            if notif_enabled:

                if data == 'stop':
                    notif_enabled = False
                else:
                    data_type = data
                """
                if data == 'p':
                      data_type = 'p'
                elif data == 't':
                    for t in temps:
                        custom_read_char.write(t)
                elif data == 'i':
                    for i in imus:
                        custom_read_char.write(i)
                """
        elif handle == 19: # CCCD of custom_read_char
            print("noti",data)
            if int(data[0]) == 1:
                notif_enabled = True
            else:
                notif_enabled = False

notif_enabled = False
custom_svc_uuid = UUID("4A981234-1CC4-E7C1-C757-F1267DD021E8")
custom_wrt_char_uuid = UUID("4A981235-1CC4-E7C1-C757-F1267DD021E8")
custom_read_char_uuid = UUID("4A981236-1CC4-E7C1-C757-F1267DD021E8")

custom_svc = Service(custom_svc_uuid)
custom_wrt_char = Characteristic(custom_wrt_char_uuid,props=Characteristic.PROP_WRITE)
custom_read_char = Characteristic(custom_read_char_uuid,props=Characteristic.PROP_READ | Characteristic.PROP_NOTIFY,attrs=Characteristic.ATTR_CCCD)
custom_svc.addCharacteristic(custom_wrt_char)
custom_svc.addCharacteristic(custom_read_char)

data_type = "p"

periph = Peripheral()
periph.addService(custom_svc)
periph.setConnectionHandler(event_handler)
periph.advertise(device_name="Ed 33 BLE Sense")

temp_tim = Timer(1, period=500000, mode=Timer.PERIODIC,callback=get_sensor_data)
temp_tim.start()

press_tim = Timer(2, period=5000000, mode=Timer.PERIODIC,callback=notify_master)
press_tim.start()

"""
imu_tim = Timer(3, period=500000, mode=Timer.PERIODIC,callback=imu_function)
imu_tim.start()
"""


