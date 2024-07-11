import logo from './logo.svg'
import './App.css'
import React, { useState, useEffect } from 'react'
import { IonApp, IonReactRouter, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { phonePortraitOutline, cogOutline } from 'ionicons/icons'
import { Footer } from './components/Footer'
import { Body } from './components/Body'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
import { Authenticator } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import amplifyconfig from './amplifyconfiguration.json'
// import { pubsub } from './utils/pubsub'
import { fetchAuthSession } from 'aws-amplify/auth'
import { PubSub } from '@aws-amplify/pubsub'

Amplify.configure(amplifyconfig)

// arn:aws:iot:ap-southeast-2:590e4438-b001-7091-2442-c4f79215ecec:topic/COMP6733
function App() {
  setupIonicReact()
  const [page, setPage] = useState('DeviceListPage')
  const pubsub = new PubSub({
    region: 'ap-southeast-2',
    endpoint: 'wss://aibmybrjyb7gc-ats.iot.ap-southeast-2.amazonaws.com/mqtt',
    // url: 'altmgdwg8ime4-ats.iot.ap-southeast-2.amazonaws.com',
  })
  const [message, setMessage] = useState('')
  useEffect(() => {
    pubsub.subscribe({ topics: ['messages'] }).subscribe({
      next: (data) => {
        setMessage(data.msg)
      },
    })
  }, [])

  // T/Wvwva1vrs7/bFD41AO5uwPPTmaOF6MJiddLzFh
  // setPage('device')
  // console.log("page", page);

  const publishMessage = async () => {
    console.log('Hello')
    await pubsub.publish({
      topics: 'test/6733',
      message: { msg: 'HELLO FROM THE APP! 2' },
    })
    // try {
    //   await pubsub.publish({
    //     topics: 'test/6733',
    //     message: { msg: 'HELLO FROM THE APP! 2' },
    //   })
    // } catch (e) {
    //   console.log(e)
    // }

    // fetchAuthSession().then((info) => {
    //   const cognitoIdentityId = info.identityId
    //   console.log(cognitoIdentityId)
    // })
    // console.log(res)
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <p>{message}</p>
          {/* <IonApp>
            <IonRouterOutlet>
              <Body page={page} setPage={setPage} />
              <Footer page={page} setPage={setPage} />
            </IonRouterOutlet>
          </IonApp> */}
          <button onClick={publishMessage}>Publish message</button>
        </main>
      )}
    </Authenticator>
  )
}

export default App
