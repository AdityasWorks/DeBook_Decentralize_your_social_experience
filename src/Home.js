import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button, Card, ListGroup } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from "axios";
import "./Home.css";

const client = ipfsHttpClient({
    host: 'gateway.pinata.cloud',
    port: '443',
    protocol: 'https',
    headers: {
      pinata_api_key: process.env.PINATA_API, 
      pinata_secret_api_key: process.env.PINATA_SECRET
    }
  });



const Home = ({ contract }) => {
    const [posts, setPosts] = useState('')
    const [hasProfile, setHasProfile] = useState(false)
    const [post, setPost] = useState('')
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(true)
    const loadPosts = async () => {
        // Get user's address
        let address = await contract.signer.getAddress()
        setAddress(address)
        // Check if user owns an nft
        // and if they do set profile to true
        const balance = await contract.balanceOf(address)
        setHasProfile(() => balance > 0)
        // Get all posts
        let results = await contract.getAllPosts()
        // Fetch metadata of each post and add that to post object.
        let posts = await Promise.all(results.map(async i => {
            let response = await fetch(`https://gateway.pinata.cloud/ipfs/${i.hash}`)
            const metadataPost = await response.json()
            const nftId = await contract.profiles(i.author)
            const uri = await contract.tokenURI(nftId)
            response = await fetch(uri)
            const metadataProfile = await response.json()
            const author = {
                address: i.author,
                username: metadataProfile.username,
                avatar: metadataProfile.avatar
            }
            // define post object
            let post = {
                id: i.id,
                content: metadataPost.post,
                tipAmount: i.tipAmount,
                author
            }
            return post
        }))
        posts = posts.sort((a, b) => b.tipAmount - a.tipAmount)
        // Sort posts from most tipped to least tipped. 
        setPosts(posts)
        setLoading(false)
    }
    useEffect(() => {
        if (!posts) {
            loadPosts()
        }
    })
    const uploadPost = async () => {
        if (!post) return
        let hash
        try {
            
            const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS',JSON.stringify({post}), {
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: process.env.PINATA_API, 
                pinata_secret_api_key: process.env.PINATA_SECRET
            }
            })
            setLoading(true)
            hash = (res.data.IpfsHash)
        } catch (error) {
            window.alert("ipfs image upload error: ", error)
        }
        // upload post to blockchain
        await (await contract.uploadPost(hash)).wait()
        loadPosts()
    }
    const tip = async (post) => {
        // tip post owner
        await (await contract.tipPostOwner(post.id, { value: ethers.utils.parseEther("0.1") })).wait()
        loadPosts()
    }
    if (loading) return (
        <div className='loadf'>
            <main style={{ padding: "1rem 0" }}>
                <h2>Loading...</h2>
            </main>
        </div>
    )
    return (
        <div className="bigdiv">
            {hasProfile ?
                (<div className="row">
                    <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                        <div className="content mx-auto ">
                            <Row className="g-4">
                                <Form.Control className='hell' onChange={(e) => setPost(e.target.value)} size="lg" required as="textarea" />
                                <div className="d-grid px-0">
                                    <Button className='postbut' onClick={uploadPost} variant="danger" size="lg">
                                        Post!
                                    </Button>
                                </div>
                            </Row>
                        </div>
                    </main>
                </div>)
                :
                (<div className="mustown">
                    <main style={{ padding: "1rem 0" }}>
                        <h2>Must own an NFT to post</h2>
                    </main>
                </div>)
            }

            <p>&nbsp;</p>
            <hr />
            <p className="posts">&nbsp;</p>
            {posts.length > 0 ?
                posts.map((post, key) => {
                    return (
                        <div key={key} className="posting" style={{ width: '1000px' }}>
                            <Card border="primary" className='cardd' bg='transparent'>
                                <Card.Header>
                                    <img
                                        className='mr-2'
                                        width='30'
                                        height='30'
                                        src={post.author.avatar}
                                    />
                                    <small className="ms-2 me-auto d-inline">
                                        {post.author.username}
                                    </small>
                                    <small className="mt-1 float-end d-inline">
                                        {post.author.address}
                                    </small>
                                </Card.Header>
                                <Card.Body color="secondary">
                                    <Card.Title>
                                        {post.content}
                                    </Card.Title>
                                </Card.Body>
                                <Card.Footer className="cardfoot">
                                    <div className="d-inline mt-auto float-start">Tip Amount: {ethers.utils.formatEther(post.tipAmount)} ETH</div>
                                    {address === post.author.address || !hasProfile ?
                                        null : <div className="d-inline float-end">
                                            <Button onClick={() => tip(post)} className="px-0 py-0 font-size-16" variant="link" size="md">
                                                Tip for 0.1 ETH
                                            </Button>
                                        </div>}
                                </Card.Footer>
                            </Card>
                        </div>)
                })
                : (
                    <div className="Nopost">
                        <main style={{ padding: "1rem 0" }}>
                            <h2>No posts yet</h2>
                        </main>
                    </div>
                )}

        </div >
    );
}

export default Home