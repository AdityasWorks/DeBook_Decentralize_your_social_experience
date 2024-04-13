import { useState, useEffect } from 'react'
import { Row, Form, Button, Card, Col } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from "axios";
import "./Profile.css";

const FormData = require('form-data')

const client = ipfsHttpClient({
    host: 'gateway.pinata.cloud',
    port: '443',
    protocol: 'https',
    headers: {
      pinata_api_key: 'ed0f881fcd1c79e0207f', 
      pinata_secret_api_key: '7619b78d960a1b1a39f550d23cabbc742d0ae2a4adb7267a6436f23a928d7827',
      Authorization: `Bearer ${process.env.PINATA_JWT}`
    }
  });

const App = ({ contract }) => {
    const [profile, setProfile] = useState('')
    const [nfts, setNfts] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)


    const loadMyNFTs = async () => {
        try {
            const results = await contract.getMyNfts();
            
            const nftData = await Promise.all(results.map(async id => {
                const tokenURI = await contract.tokenURI(id);
                const response = await fetch(tokenURI);
                const metadata = await response.json();
                return {
                    id,
                    username: metadata.username,
                    avatar: metadata.avatar
                };
            }));
    
            setNfts(nftData);
    
            getProfile(nftData);
        } catch (error) {
            console.error('Error loading NFTs:', error);
        }
    };
    
    const getProfile = async (nfts) => {
        const address = await contract.signer.getAddress()
        const id = await contract.profiles(address)
        const profile = nfts.find((i) => i.id.toString() === id.toString())
        setProfile(profile)
        setLoading(false)
    }
    
    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                const formData = new FormData();
                formData.append("file", file);
    
                const response = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: 'ed0f881fcd1c79e0207f', 
                        pinata_secret_api_key: '7619b78d960a1b1a39f550d23cabbc742d0ae2a4adb7267a6436f23a928d7827',
                        PINATA_JWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMGU2ZTdiMC0yYzA2LTQ3ZDUtODRjMC0yYTczNDQyMGJhM2UiLCJlbWFpbCI6ImhleWFhZGkyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlZDBmODgxZmNkMWM3OWUwMjA3ZiIsInNjb3BlZEtleVNlY3JldCI6Ijc2MTliNzhkOTYwYTFiMWEzOWY1NTBkMjNjYWJiYzc0MmQwYWUyYTRhZGI3MjY3YTY0MzZmMjNhOTI4ZDc4MjciLCJpYXQiOjE3MTI2MzcyNzl9.j9SFvwWptG8lRpx1EkDXxBe1Vc3kSrS4sYC7ciegqYQ',
                        "Content-Type": "multipart/form-data"
                    },
                });
                setAvatar(`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);

            } catch (error) {
                console.log("Pinata image upload error: ", error);
            }
        }
    };
    const mintProfile = async () => {
        if (!avatar || !username) return;
        try {
            setLoading(true);
            const response = await client.add(JSON.stringify({avatar,username}));
            const ipfsUri = `https://rose-changing-dormouse-552.mypinata.cloud/ipfs/${response.path}`;
            await (await contract.mint(ipfsUri)).wait()
            await loadMyNFTs();
            setLoading(false);
        } catch (error) {
            console.error('Error minting profile NFT:', error);
            setLoading(false);
        }
    };
    
    const switchProfile = async (nft) => {
        setLoading(true)
        await (await contract.setProfile(nft.id)).wait()
        getProfile(nfts)
    }
    useEffect(() => {
        if (!nfts) {
            loadMyNFTs()
        }
    })
    if (loading) return (
        <div className='text-center'>
            <main style={{ padding: "1rem 0" }}>
                <h2>Loading...</h2>
            </main>
        </div>
    )
    return (
        <div className="mt-4 text-center">
            {profile ? (<div className="mb-3"><h3 className="mb-3">{profile.username}</h3>
                <img className="mb-3" style={{ width: '400px' }} src={profile.avatar} /></div>)
                :
                <h4 className="mb-4">No NFT profile, please create one...</h4>}

            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Form.Control
                                type="file"
                                required
                                name="file"
                            
                            />
                            <Form.Control onChange={(e) => setUsername(e.target.value)} size="lg" required type="text" placeholder="Username" />
                            <div className="d-grid px-0">
                                <Button classname="mintbutton" onClick={mintProfile} variant="primary" size="lg" color='purple'>
                                    Mint NFT Profile
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
            <div className="px-5 container">
                <Row xs={1} md={2} lg={4} className="g-4 py-5">
                    {nfts.map((nft, idx) => {
                        if (nft.id === profile.id) return
                        return (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={nft.avatar} />
                                    <Card.Body color="secondary">
                                        <Card.Title>{nft.username}</Card.Title>
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className='d-grid'>
                                            <Button onClick={() => switchProfile(nft)} variant="primary" size="lg">
                                                Set as Profile
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        </div>
    );
}

export default App;