import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';

import React, { useState } from 'react';
import axios from "axios"
import { useToast } from '@chakra-ui/react'
import {useHistory} from "react-router-dom"

const SignUp = () => {
    const [show, setshow] = useState(false);
    const [showC, setshowC] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    const history = useHistory();

    const  handleShowClick = () => setshow(!show);
    const  handleConfimClick = () => setshowC(!showC);

    const  postDetails = (pics) => {

        setLoading(true);
        if(pics === undefined){
            toast({
                title: 'Account created.',
                description: "We've created your account for you.",
                status:'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
              });
              return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat app");
            data.append("cloud_name", "dvyqo6xbp");
            fetch("https://api.cloudinary.com/v1_1/dvyqo6xbp/image/upload", {
              method: "post",
              body: data,
            })
              .then((res) => res.json())
              .then((data) => {
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
              });
          } else {
            toast({
              title: "Please Select an Image!",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
            return;
          }
    };

    const SubmitHandler = async () =>{
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: 'Please Fill all the fields',
                status:'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
              });
              setLoading(false)
              return;
            }
        if(password !== confirmPassword){
            toast({
                title: 'Password Do not match',
                status:'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
                });
                return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const {data} = await axios.post(
                "/api/user",
                {name,email,password,pic},
                config
            );
            toast({
                title: 'Registration Succesful',
                status:'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        }catch (error){
            toast({
                title: 'ERROR',
                description: error.response.data.message,
                status:'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing='5px'>
            <FormControl id ="firts-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter your Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id ="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id ="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Enter your Password'
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width = "4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                            { show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id ="confirm password" isRequired>
                <FormLabel>Confim Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Enter your Password'
                        type={showC ? "text" : "Password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width = "4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleConfimClick}>
                            { showC ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Profile Picture</FormLabel>
                <Input
                    type='file'
                    p = {1.5}
                    accept='image/'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button 
                colorScheme = "red" 
                width={"100%"} 
                style={{marginTop : 15}}
                color= "white"
                onClick={SubmitHandler}
                isLoading={loading}
            >   
                Sign Up
            </Button>
            
        </VStack>
    );
};

export default SignUp;
