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


green_timer_start = False
temps = []
press = []
imus = []


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
    global custom_read_char2
    global press
    global dataType1
    global _typedata2
    global press
    global temps
    global imus

    if notif_enabled:
        if dataType1 == 'p':
         custom_read_char.write(press[0])
        elif dataType1 == 't':
         custom_read_char.write(temps[0])
        else:
         custom_read_char.write(imus[0])
    if notif_enabled2:
        if _typedata2 == 'p':
         custom_read_char2.write(press[0])
        elif _typedata2 == 't':
         custom_read_char2.write(temps[0])
        else:
         custom_read_char2.write(imus[0])

    
def event_handler(id, handle, data):
    global periph
    global services
    global custom_read_char
    global custom_read_char2
    global notif_enabled
    global notif_enabled2
    global press
    global temps
    global imus
    global dataType1
    global _typedata2

    if id == constants.EVT_GAP_CONNECTED:
        pass
    elif id == constants.EVT_GAP_DISCONNECTED:
        # restart advertisement
        notif_enabled = False
        notif_enabled2 = False
        periph.advertise(device_name="Ed 33 BLE Sense")
    elif id == constants.EVT_GATTS_WRITE:
        
        if handle == 16: # custom_wrt_char
            if notif_enabled:
                if data == 'stop':
                    notif_enabled = False
                else:
                    if data == 'p':
                         dataType1 = 'p' 
                    elif data == 't':
                         dataType1 = 't'                         
                    elif data == 'i':
                         dataType1 = 'i' 
        elif handle == 19: # CCCD of custom_read_char
            print("noti",data)
            if int(data[0]) == 1:
                notif_enabled = True
            else:
                notif_enabled = False

        elif handle == 22: # custom_wrt_char
            if notif_enabled2:
                if data == 'stop':
                    notif_enabled2 = False
                else:
                    if data == 'p':
                         _typedata2 = 'p' 
                    elif data == 't':
                         _typedata2 = 't'                         
                    elif data == 'i':
                         _typedata2 = 'i'                   
        elif handle == 25: # CCCD of custom_read_char
            print("noti",data)
            if int(data[0]) == 1:
                notif_enabled2 = True
            else:
                notif_enabled2 = False


notif_enabled = False
custom_svc_uuid = UUID("4A981234-1CC4-E7C1-C757-F1267DD021E8")
custom_wrt_char_uuid = UUID("4A981235-1CC4-E7C1-C757-F1267DD021E8")
custom_read_char_uuid = UUID("4A981236-1CC4-E7C1-C757-F1267DD021E8")
custom_svc_uuid2 = UUID("4A981237-1CC4-E7C1-C757-F1267DD021E8")
custom_wrt_char_uuid2 = UUID("4A981238-1CC4-E7C1-C757-F1267DD021E8")
custom_read_char_uuid2 = UUID("4A981239-1CC4-E7C1-C757-F1267DD021E8")


custom_svc = Service(custom_svc_uuid)
custom_wrt_char = Characteristic(custom_wrt_char_uuid,props=Characteristic.PROP_WRITE)
custom_read_char = Characteristic(custom_read_char_uuid,props=Characteristic.PROP_READ | Characteristic.PROP_NOTIFY,attrs=Characteristic.ATTR_CCCD)
custom_svc.addCharacteristic(custom_wrt_char)
custom_svc.addCharacteristic(custom_read_char)

notif_enabled2 = False
custom_svc2 = Service(custom_svc_uuid2)
custom_wrt_char2 = Characteristic(custom_wrt_char_uuid2,props=Characteristic.PROP_WRITE)
custom_read_char2 = Characteristic(custom_read_char_uuid2,props=Characteristic.PROP_READ | Characteristic.PROP_NOTIFY,attrs=Characteristic.ATTR_CCCD)
custom_svc2.addCharacteristic(custom_wrt_char2)
custom_svc2.addCharacteristic(custom_read_char2)

dataType1 = "p"
_typedata2 = "t"

periph = Peripheral()
periph.addService(custom_svc)
periph.addService(custom_svc2)
periph.setConnectionHandler(event_handler)
periph.advertise(device_name="Ed 33 BLE Sense")

temp_tim = Timer(1, period=500000, mode=Timer.PERIODIC,callback=get_sensor_data)
temp_tim.start()

press_tim = Timer(2, period=5000000, mode=Timer.PERIODIC,callback=notify_master)
press_tim.start()



