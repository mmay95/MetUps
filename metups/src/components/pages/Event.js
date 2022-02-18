import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Map, { Marker } from 'react-map-gl'
import { mapToken } from '../../config/enviroments.js'

// Import helpers
import { getTokenFromLocalStorage } from '../../auth/helpers'

// Import Bootstrap Components
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
// Import Chakra Components
import { Box, Divider, Image, Input, Wrap, WrapItem } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Table, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { Badge } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

const SingleEvent = ({ user, userGeoLocation, allEvents }) => {
  const [event, setEvent] = useState(null)
  const [updatedEventLocation, setUpdatedEventLocation] = useState(null)
  const [hasError, setHasError] = useState({ error: false, message: '' })
  const [hasLiked, setHasLiked] = useState(null)
  const [comments, setComments] = useState({
    owner: '',
    text: '',
  })

  const [likedBy, setLikedBy] = useState([])

  const { id } = useParams()

  // EVENTS API
  useEffect(() => {
    const getSingleEvent = async () => {
      try {
        const { data } = await axios.get(`/api/events/${id}`)
        setLikedBy(data.likedBy)
        setEvent(data)
      } catch (err) {
        console.log(err)
        setHasError({ error: true, message: err.message })
      }
    }
    getSingleEvent()
  }, [id])

  // update event.locationName api
  useEffect(() => {
    // console.log('event ->', event)
    if (event && !event.isDemo) {
      setUpdatedEventLocation({
        longitude: event.longitude,
        latitude: event.latitude,
        locationName: event.locationName,
      })
    } else {
      event &&
        allEvents.forEach((item) => {
          console.log('item ->', item._id, event._id)
          const getRealAddress = async (long, lat) => {
            try {
              const { data } = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${mapToken}`
              )
              // console.log(data.features[0].place_name)
              console.log('get real address')
              setUpdatedEventLocation({
                longitude: item.longitude,
                latitude: item.latitude,
                locationName: data.features[0].place_name,
              })
            } catch (err) {
              console.log(err)
            }
          }

          if (item._id === event._id) {
            console.log('IDS match')
            getRealAddress(item.longitude, item.latitude)
          }
        })
    }
  }, [event, allEvents])

  // LIKES API
  const handleLikes = async (e) => {
    e.preventDefault()
    const hasLiked = likedBy.some((like) => user._id === like.owner._id)
    console.log(hasLiked)
    const updatedLikedByArray = likedBy
    if (hasLiked) {
      updatedLikedByArray.forEach((like, i) => {
        if (user._id === like.owner._id) {
          updatedLikedByArray.splice(i, 1)
          console.log('REMOVED FROM ARRAY ->', updatedLikedByArray)
        }
      })
    }
    if (!hasLiked) {
      updatedLikedByArray.push({ owner: user })
      console.log('ADDED TO ARRAY ->', updatedLikedByArray)
    }
    try {
      await axios.put(
        `/api/events/${id}/likes`,
        { likedBy: updatedLikedByArray },
        {
          headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
        }
      )
      const getSingleEvent = async () => {
        try {
          const { data } = await axios.get(`/api/events/${id}`)
          setEvent(data)
        } catch (err) {
          setHasError({ error: true, message: err.message })
        }
      }
      getSingleEvent()
    } catch (err) {
      console.log(err.response)
    }
  }

  // HANDLECHANGE AND SUBMIT FOR COMMENT
  const handleChange = (e) => {
    if (e.target) {
      const newObj = { ...comments, [e.target.name]: e.target.value }
      setComments(newObj)
    } else {
      console.log(e)
      const arrayOfValues = e.map((comments) => {
        return comments.owner.username
      })
      console.log(arrayOfValues)
      const newValue = { ...comments, text: arrayOfValues }
      setComments(newValue)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/events/${id}/comments`, comments, {
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
      setComments({ ...comments, text: '' })
      const getSingleEvent = async () => {
        try {
          const { data } = await axios.get(`/api/events/${id}`)
          setEvent(data)
        } catch (err) {
          setHasError({ error: true, message: err.message })
        }
      }
      getSingleEvent()
    } catch (err) {
      console.log(err.response)
    }
  }

  return (
    <>
      <section>
        {event && updatedEventLocation ? (
          <Container className='pt-5 mx-9000'>
            <Row>
              <Col md={12}>
                {/* EVENT IMAGE AND EVENT NAME*/}
                <Image
                  className='img-fluid shadow-2-strong'
                  src={event.image}
                  alt='event image'
                />
              </Col>
              <Col md={12} className='my-3'>
                <Heading>{event.eventName}</Heading>
              </Col>
              {event.owner ? (
                // Col for all info of event owner and event info
                <Col md={12} className='mb-3'>
                  <Row>
                    <Col md={6}>
                      {/*  HOSTED BY */}
                      <Row className='justify-content-center'>
                        <Col md={12} className='mb-3'>
                          <Image
                            borderRadius='full'
                            src={event.owner.profilePhoto}
                            alt="host's profile image"
                          />
                        </Col>
                        <Col md={12} className='mb-3'>
                          <p> Hosted by: {event.owner.name} </p>
                        </Col>
                        {/* Button and attendies */}
                        <Col md={12} className='mb-2'>
                          {/* LIKE BUTTON */}
                          {likedBy && user ? (
                            likedBy.some((like) => {
                              return user._id === like.owner.id
                            }) ? (
                              <Button
                                className='px-5'
                                colorScheme='blue'
                                onClick={handleLikes}
                              >
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                className='px-5'
                                colorScheme='red'
                                onClick={handleLikes}
                              >
                                RSVP
                              </Button>
                            )
                          ) : (
                            ''
                          )}
                        </Col>
                        <Col md={12}>
                          <Wrap>
                            {likedBy &&
                              likedBy
                                .sort(
                                  (a, b) =>
                                    new Date(b.createdAt) -
                                    new Date(a.createdAt)
                                )
                                .map((like) => {
                                  return (
                                    <WrapItem key={like.owner._id}>
                                      <Avatar
                                        name={like.owner.name}
                                        src={like.owner.profilePhoto}
                                      />
                                    </WrapItem>
                                  )
                                })}
                          </Wrap>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      {/* Event Info */}
                      <Box border='1px solid grey' borderRadius='xl'>
                        <Table variant='simple'>
                          <Tbody>
                            <Tr>
                              <Th>Type</Th>
                              <Td>
                                {event.eventType.map((type) => {
                                  // maybe have each type srounded in a light colored box of sorts?
                                  return <Badge key={type}>{type}</Badge>
                                })}
                              </Td>
                            </Tr>
                            <Tr>
                              <Th>Date:</Th>
                              <Td>
                                <Badge>{event.eventDate}</Badge>
                              </Td>
                            </Tr>
                            <Tr>
                              <Th>Time:</Th>
                              <Td>
                                <Badge>{event.eventTime}</Badge>
                              </Td>
                            </Tr>
                            <Tr>
                              <Th>Event Location:</Th>
                              <Td>
                                <Text fontSize='sm' fontStyle='bold'>
                                  {updatedEventLocation.locationName}
                                </Text>
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                    </Col>
                  </Row>
                </Col>
              ) : (
                <Spinner animation='border'></Spinner>
              )}
              {/* Map */}
              <Col md={12} className='mb-3'>
                {userGeoLocation && (
                  <Map
                    initialViewState={{
                      longitude: updatedEventLocation.longitude,
                      latitude: updatedEventLocation.latitude,
                      zoom: 13,
                    }}
                    style={{ height: 200 }}
                    mapStyle='mapbox://styles/mapbox/streets-v11'
                    mapboxAccessToken={mapToken}
                  >
                    <Marker
                      color='green'
                      longitude={updatedEventLocation.longitude}
                      latitude={updatedEventLocation.latitude}
                    ></Marker>
                  </Map>
                )}
              </Col>
              {/* Description */}
              <Col mb={12} className='mb-3'>
                <Text>{event.description}</Text>
              </Col>
              {/* Comment Submit */}
              <Col md={12} className='mb-3'>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          name='text'
                          as='textarea'
                          onChange={handleChange}
                          placeholder='Add Comment Here'
                          value={comments.text}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Button name='text' type='submit'>
                          Post Comment
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Col>
              {/* Comments */}
              <Col md={12}>
                <Row>
                  {!event.comments.length ? (
                    <></>
                  ) : (
                    <>
                      {event.comments
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .map((comment) => {
                          return (
                            <Col md={6} key={comment._id}>
                              <Box border='1px solid grey' className='mb-2'>
                                <Row
                                  className='p-2'
                                  style={{ backgroundColor: 'white' }}
                                >
                                  <Col>
                                    <Avatar src={comment.owner.profilePhoto} />
                                  </Col>
                                  <Col>
                                    <Text>{comment.owner.username}</Text>
                                  </Col>
                                  <Row>
                                    <Col>
                                      <Text>{comment.text}</Text>
                                    </Col>
                                  </Row>
                                </Row>
                              </Box>
                            </Col>
                          )
                        })}
                    </>
                  )}
                </Row>
              </Col>
              <Row>
                <Col>
                  <div></div>
                </Col>
              </Row>
            </Row>
          </Container>
        ) : (
          <div>loading</div>
        )}
      </section>
    </>
  )
}

export default SingleEvent
