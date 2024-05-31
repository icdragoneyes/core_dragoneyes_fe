/* eslint-disable react/no-unknown-property */
import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import handScene from "../assets/3D/hand_animation_test.glb";

const Hand = (props) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(handScene);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions.Anim01.play();
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null} position={[0, -7, -70]} rotation={[0, 0, 0]} scale={0.05}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="e67bda409e144055a9db1b6ba50880cafbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="grpMAO" scale={10}>
                  <group name="M��o">
                    <group name="Object_6">
                      <primitive object={nodes._rootJoint} />
                      <skinnedMesh name="Object_9" geometry={nodes.Object_9.geometry} material={materials.StingrayPBS1} skeleton={nodes.Object_9.skeleton} />
                      <group name="Object_8" />
                      <group name="group1" scale={0.1}>
                        <group name="MAO_LP3" />
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default Hand;
