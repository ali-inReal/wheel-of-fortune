import React, { useEffect, useImperativeHandle, useState } from 'react'
import { useRef } from "react"
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Prize } from './prize'
import wheelSound from "./../assets/sound.mp3"
import { Howl } from 'howler'
import win from "././../assets/win.mp3"
import { forwardRef } from 'react'
export const WheelOfFortune = forwardRef(({soundOn,spinTime,textOrientation,textSize,segments, innerRadius, outerRadius, position,result,setResult },ref) => {
    var initialRotationSpeed = 0.6;
    var minimumRotationSpeed = 0.01;
    const rings = useRef([])
    const [sound,setSound]=useState(null);
    const [winSound,setWinSound]=useState(null)
    useImperativeHandle(ref,()=>({
         clickHandler() {
            sound.play()
            setIsSpinning(true)
            var randomAngle = (Math.random() * (2 * Math.PI) * spinTime)
            var finalAngle = Math.round((randomAngle) / (2 * Math.PI / segments.length)) * (2 * Math.PI / segments.length);
            group.current.rotation.z = 0;
            finalAngle = finalAngle + 10 * Math.PI + (0.174/2)
            console.log(finalAngle)
            setTargetAngle(finalAngle)
            setCurrentAngle(group.current.rotation.z)
            const index = Math.floor((finalAngle / (2 * Math.PI / segments.length) + (segments.length>10?3:segments.length<=6?segments.length<3?0:1:2))) % segments.length
            // console.log(rings.current[index])
            console.log(segments[index].name)
            setResult(index);
            
            
        }
    }))
    useEffect(
        ()=>{
            const winSound = new Howl(
                {
                    src:[win],
                    preload:true
                }
            )
            const sound = new Howl(
                {
                    src:[wheelSound],
                    preload:true
                }
            )
            
            setSound(sound)
            setWinSound(winSound)
        },[]
    )
    const [isSpinning,setIsSpinning] = useState(false);
    const group = useRef(null);
    const [currentAngle, setCurrentAngle] = useState(0);
    const [targetAngle, setTargetAngle] = useState(0);
    const updateCurrentAngle = () => {
        const currentRotation = group.current.rotation.z;
        setCurrentAngle(currentRotation);
    };
    

    // console.log(result)
    const rotateWheel = () => {
        const remainingAngle = targetAngle - currentAngle;

        // Calculate the rotation speed based on the remaining angle
        if(isSpinning)
        {
            const rotationSpeed =
            remainingAngle > Math.PI / 2
                ? initialRotationSpeed
                : Math.max(
                    minimumRotationSpeed,
                    (initialRotationSpeed * remainingAngle) / (Math.PI / 2)
                );
        // Rotate the wheel by the calculated speed
        // console.log(remainingAngle)
        if (remainingAngle > 0.01) {
            group.current.rotation.z += rotationSpeed;
        } else if (remainingAngle < -0.01) {
            group.current.rotation.z -= rotationSpeed;
        } else {
            group.current.rotation.z = targetAngle;
            // sound.stop();
            // console.log("paused!")
            setIsSpinning(false)
        
          
        }

        updateCurrentAngle();}
    };
    useFrame(
        (state, delta) => {
            rotateWheel();
        }
    )
    
    useEffect(
        ()=>{
            if(sound!=null)
            {if((!isSpinning && soundOn))
            
            {
                if(soundOn)
                {sound.on('stop',function (){
                    winSound.play()
                })
                sound.stop()
                
                console.log("paused")}
            }}
        },[isSpinning]
    )
    

    return (

        <group   position={[0,0,0]} ref={group}>
            {
                segments.map(
                    (segment, index) => {
                        
                        return (
                            <mesh
                                visible
                                position={position}
                                rotation={[0, 0, 0]}
                                castShadow
                                key={index}
                            >
                                <Html
                                    position={[0, 0, 0]}
                                    distanceFactor={10}
                                    transform
                                    material={
                                        <meshBasicMaterial color={"black"} />
                                    }
                                >
                                 
                                    <Prize index={index} textOrientation={textOrientation} textSize={textSize} length={segments.length} text={segment.name} image={segment.image} />
                                </Html>
                                <ringBufferGeometry  args={[innerRadius, outerRadius, 32, 2, ((2 * Math.PI) / segments.length) * index, (2 * Math.PI) / segments.length]} />
                                <meshBasicMaterial  toneMapped={false} name={segment.name} attach="material" emissiveIntensity={2} color={segment.color} />
                            </mesh>
                        )
                    }
                )


            }
        </group>

    )
}
)