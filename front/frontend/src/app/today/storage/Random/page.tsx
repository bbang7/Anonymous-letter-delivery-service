'use client'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { OrbitControls, Stars } from '@react-three/drei'
import RandomModel from '../../../../component/today/todayStorage/random/randomPlanet/randomPlanet'
import GradientBackground from '../../../../component/Three/three.styled'
import { Models } from '@/component/today/todayStorage/random/planetModel/planetModel'
import RocketModel from '@/component/today/todayStorage/random/rocketModel/rocketModel'
import * as THREE from 'three'
import RandomPlanet from '../../../../component/today/todayStorage/random/randomPlanet/randomPlanet'
import { useGesture } from '@use-gesture/react'
import Light from '@/component/today/todayStorage/light/light'
import RandomListGet from '@/app/utils/todayStorage/random/randomListGet'
import { randomDetailGet } from '@/app/utils/todayStorage/random/randomDetailGet'
import { useRouter } from 'next/navigation'
import { BackButton, HtmlContainer, RandomContainer } from './random.styled'

export default function TodayRandomStorage() {
  const [noteList, setNoteList] = useState<null | any>(null)
  const [detail, setDetail] = useState<null | any>(null)

  const router = useRouter()

  useEffect(() => {
    const handleListApi = async () => {
      const response = await RandomListGet()
      console.log(response.data.data)

      setNoteList(response.data.data)
    }
    handleListApi()
  }, [])

  const handleDetailApi = async (
    id: number,
    modelIndex: number,
    senderName: string,
  ) => {
    const response = await randomDetailGet(id)
    console.log(response)

    setDetail(response)

    // router.push(`/storage/random/{roomID}?planetNumber={number}&senderName={string}`)
    router.push(
      `/storage/random/${response.id}?planetNumber=${modelIndex}&senderName=${senderName}`,
    )
  }

  const goBack = () => {
    router.back()
  }

  // const Data = () => {
  //   return [
  //     {
  //       id: 1,
  //       senderId: 1,
  //       senderName: '빛나는 북극토끼',
  //       receiverId: 33,
  //       receiverName: '졸린 봉황',
  //       content: '어쩔티비',
  //       createdAt: '2023-11-02T09:57:51.124853',
  //       send: true,
  //       read: true,
  //     },
  //     {
  //       id: 6,
  //       senderId: 33,
  //       senderName: '졸린 봉황',
  //       receiverId: 1,
  //       receiverName: '빛나는 북극토끼',
  //       content: '저쩔티비',
  //       createdAt: '2023-11-02T09:57:51.093082',
  //       send: false,
  //       read: true,
  //     },
  //   ]
  // }

  const totalAmount = noteList?.count || 0
  console.log(totalAmount)

  const planeRefs = Array(totalAmount)
    .fill(null)
    .map(() => ({ current: null as THREE.Object3D | null }))

  const bind = useGesture({
    onDrag: ({ offset: [x, y], direction: [mx, my] }) => {
      const absoluteY = Math.abs(y)
      console.log('direction', mx, my)
      console.log('offset', x, y)

      planeRefs.forEach((ref) => {
        if (ref.current) {
          if (my > 0) {
            ref.current.position.y += absoluteY * -0.0001
            ref.current.position.z += absoluteY * -0.0012
          } else if (my < 0) {
            ref.current.position.y += absoluteY * 0.0001
            ref.current.position.z += absoluteY * 0.0012
          }
          // ref.current.position.x += x * 0.05
        }
      })
    },
  })
  return (
    <RandomContainer>
      <Canvas
        style={{
          touchAction: 'none',
          width: '100vw',
          height: '100vh',
          position: 'relative',
          zIndex: '1',
        }}
        camera={{
          position: [-22, 50, -100],
          // rotation: [0, Math.PI / 8, 0],
          near: 0.01,
        }}
        {...bind()}
      >
        <Stars
          radius={100}
          depth={25}
          count={6000}
          factor={8}
          saturation={1}
          fade
          speed={2}
        />
        <Light />
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          {noteList?.roomListResDtoList &&
            noteList.roomListResDtoList.map((item: any, index: number) => {
              console.log('item', item.id)

              const randomIndex = Math.floor(Math.random() * Models.length)
              const modelIndex = randomIndex % Models.length
              const model = Models[modelIndex]
              const startPostion = [-3, -20, -63]
              const position = [
                startPostion[0],
                startPostion[1] + 10 * index,
                startPostion[2] + 120 * index,
              ]
              return (
                <RandomPlanet
                  key={item.id}
                  url={model.url}
                  scale={model.scale}
                  position={position}
                  mesh={planeRefs[index]}
                  onClick={() =>
                    handleDetailApi(item.id, modelIndex, item.senderName)
                  }
                />
              )
            })}
          <RocketModel
            url="/assets/rocket-1.glb"
            scale={[10, 10, 10]}
            position={[-23, 73, 85]}
            rotation={[Math.PI / 4.5, Math.PI, Math.PI / -8]}
          />
        </Suspense>
        {/* <OrbitControls /> */}
      </Canvas>
      <HtmlContainer>
        <BackButton onClick={() => goBack()}>뒤로가기</BackButton>
      </HtmlContainer>
    </RandomContainer>
  )
}
