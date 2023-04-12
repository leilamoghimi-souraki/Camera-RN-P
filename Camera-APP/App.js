import React, {useEffect,useRef,useState} from 'react';
import { StyleSheet,Text, View , Image} from 'react-native';
import { Camera,CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './src/components/Button';
import Constants from 'expo-constants';

export default function App() {
  const [cameraPermisstion, setCameraPermission]= useState(null);
  const [image,setImage]= useState(null);
  const[type, setType]= useState(Camera.Constants.Type.back);
  const [flash,setFlash]=useState(Camera.Constants.FlashMode.off);
  const cameraRef =useRef(null);


  useEffect(()=> {
    (async()=> {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus= await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    })();
  },[])

  const takePicture = async () =>{
    if(cameraRef) {
     try{
      const data = await cameraRef.current.takePictureAsync();
       console.log(data);
       setImage(data.uri);
     } catch(e) {
       console.log(e);
     }
    }
 }
 const saveImage = async () => {
  if (image) {
    try {
      await MediaLibrary.createAssetAsync(image);
      alert('Picture saved! 🎉');
      setImage(null);
      
    } catch (e) {
      console.log(e);
    }
  }
};

 if(cameraPermisstion === false) {
  return <Text> NO ACCESS TO CAMERA</Text>
 }

  return (
    <View style={styles.container}>
      {!image ? (
      <Camera
      style={styles.camera}
      type={type}
      flashMode={flash}
      ref={cameraRef}
      >
        <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
            }}
          >
            <Button
              title=""
              icon="retweet"
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            />
            <Button
              onPress={() =>
                setFlash(
                  flash === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }
              icon="flash"
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#fff'}
            />
          </View>

      </Camera>
      ):(
      <Image source={{ur: image}} style={styles.camera}/>
      )}
      <View>
        {image  ?(
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50,
        }}>
          <Button title={'Re-Take'} onPress={() => setImage(null)} icon='retweet'/>
          <Button title={"Save"} onPress={saveImage} icon="check" />
          </View>
          ):(
        <Button title={'Take a Picture'} icon='camera' onPress={takePicture}/>
        
          )}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000',
    padding: 8,
  },controls: {
    flex: 0.5,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
});
