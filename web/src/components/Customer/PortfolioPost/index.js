import React, { useState, useEffect } from 'react';
import { Modal, Card, CardActionArea, CardMedia, Box, Typography, Button, Grid, Tab, Tabs, AppBar, Hidden, FormControlLabel, Avatar, Input, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Error, BurstMode, NavigateBefore, NavigateNext } from '@material-ui/icons'
import { FiTrash2 } from 'react-icons/fi';
import { Formik, Form } from 'formik'
import axios from 'axios'
import theme from '../../../theme'

import * as Yup from 'yup'

import TextField from '../../FormsUI/TextField/index'
import TextArea from '../../FormsUI/TextArea/index'
import CustomButton from '../../FormsUI/Button/index'
import Checkbox from '../../FormsUI/Checkbox/index'

import api from '../../../services/api';

export default function PortfolioPost(props){
  const [userId, setUserId] = useState(localStorage.getItem("id"));
  const [postId, setPostId] = useState(props.postId);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [tags, setTags] = useState(props.tags);
  const [featured, setFeatured] = useState(props.featured);
  const [images, setImages] = useState(props.images);
  const [imagesIndex, setImagesIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);

  const [files, setFiles] = useState(null);
  const [newFilesAdded, setNewFilesAdded] = useState(false)
  const [uploadLabelValue, setUploadLabelValue] = useState('Upload pictures...');

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [clickedToDelete, setClickedToDelete] = useState(false);

  useEffect(() => {
   
  }, [])

  function nextImage(){
    var newIndex = imagesIndex + 1;
    setImagesIndex(newIndex) 
  }

  function previousImage(){
    var newIndex = imagesIndex - 1;
    setImagesIndex(newIndex) 
  }

  async function handleImageDelete(){
    try {

      const response = await api.delete('portfolioimages', { data: { id: images[imagesIndex].id }});

      setImagesIndex(imagesIndex - 1)

      const responseUpdatedImages = await api.get(`/portfolioimages/posts/${postId}`);

      setImages(responseUpdatedImages.data.images)
      
    } catch (error) {
      setErrorMessage(error.responseUpdatedImages.data.message)
    }
  }

  const handleImageOpen = () => {
    setImageOpen(true);
  };

  const handleImageClose = () => {
    setImageOpen(false);
  };

  async function handleFileSelected(event){
    setFiles(event.target.files)
    setUploadLabelValue(event.target.files.length + ' Files Selected...')
    setNewFilesAdded(true)
  }


  async function handleClickedToDelete(){
    setClickedToDelete(true)
  }

  async function handlePostCreation(values){
    const data = {
      userId: userId,
      title: values.title,
      description: values.description,
      tags: values.tags,
      featured: values.featured,
    }

    try {
      //Saving Post 
      const response = await api.post('portfolioposts', data);
      
      //Uploading images
      var formData = new FormData();
      for (let i = 0; i < files.length; i++){
        formData.append(`files`, files[i])
      }
      formData.append('postId', response.data.portfolioPost[0])

      const imagesResponse = await api.post('portfolioimages', formData, {
        headers: {
          'Content-type': 'multipart/form-data'
        }
      });

      window.location.reload();

    } catch (error) {
      setErrorMessage(error.response.data.message)
    }
  }

  async function handlePostUpdate(values){
    const data = {
      id: postId,
      userId: userId,
      title: values.title,
      description: values.description,
      tags: values.tags,
      featured: values.featured,
    }

    try {
      //Saving Post 
      const response = await api.put('portfolioposts', data);
      
      //Uploading images
      if(newFilesAdded){
        var formData = new FormData();
        for (let i = 0; i < files.length; i++){
          formData.append(`files`, files[i])
        }
        formData.append('postId', postId);

        const imagesResponse = await api.post('portfolioimages', formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        });
      }

      window.location.reload();

    } catch (error) {
      setErrorMessage(error.response.data.message)
    }
  }

  async function handleDeletePost(){
    try {
      const response = await api.delete('portfolioposts', { data: { id: postId }});

      window.location.reload();
      
    } catch (error) {
      setErrorMessage(error.response.data.message)
    }

  }


  const useStyles = makeStyles({
    componentGridNewPost: {
      backgroundColor: "#fff",
      borderRadius: 8,
      alignItems: "center",
      justifyItems: "center",
      padding: 25,
      maxHeight: 600,
      maxWidth: 500,
    },
    componentGridEditPost: {
      backgroundColor: "#fff",
      borderRadius: 8,
      alignItems: "center",
      justifyItems: "center",
      padding: 25,
      maxHeight: 1000,
      maxWidth: 500,
      overflowY: 'scroll',

      [theme.breakpoints.down('xs')]: {
        maxHeight: 700,
        maxWidth: 350,
      },
    },
    header:{
      marginBottom: 30,
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 17,
      '&:hover': {
        cursor: 'pointer',
        opacity: 0.5,
      }
    },
    icon: {
      marginRight: 10,
    },
    fileInput: {
      display: 'none',
    },
    button: {
      marginTop: 30,
      marginBottom: 15,
    },
    imagesIndex: {
      marginTop: 14
    },
    modalImageContainer:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalImage:{
      maxHeight: 500,
      maxWidth: 600,
    },
    
  });
  const classes = useStyles();

  const INITIAL_FORM_STATE = {
    title: title,
    description: description,
    tags: tags,
    featured: featured,
  };

  const FORM_VALIDATION = Yup.object().shape({
    title: Yup.string().required("Title is a mandatory field"),
    description: Yup.string().required("Description is a mandatory field"),
  });

  if(postId){
    return (
      <Grid container justify="center" className={classes.componentGridEditPost} >

        <Grid item xs={12}>
          <Typography variant="h4" className={classes.header}>
            Portfolio Post
          </Typography>
        </Grid>

        <Grid container >
          <Modal
            className={classes.modalImageContainer}
            open={imageOpen}
            onClose={handleImageClose}
          >
            <img className={classes.modalImage} src={images[imagesIndex].url} alt={title}/>
          </Modal>
        </Grid>

        <Grid container justify="center" spacing={3} className={classes.controlButtons}>
          <Grid item>
            <CardActionArea>
              <CardMedia
                component="img"
                alt={title}
                height="275"
                image={images[imagesIndex].url}
                title={title}
                onClick={handleImageOpen}
              />
            </CardActionArea>
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={3} className={classes.controlButtons}>
          <Grid item>
            <IconButton 
              color="primary"
              aria-label="previous"
              onClick={previousImage}
              disabled={imagesIndex > 0 
                        ? false
                        : true
                      }
            >
              <NavigateBefore />
            </IconButton>
          </Grid>

          <Grid item className={classes.imagesIndex}>
            <Typography variant="body2"> 
              {imagesIndex + 1}/{images.length}
            </Typography>
          </Grid>

          <Grid item>
            <IconButton 
              color="primary"
              aria-label="next"
              onClick={nextImage}
              disabled={imagesIndex < (images.length - 1) 
                ? false
                : true
              }
            >
              <NavigateNext />
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton 
              color="primary"
              aria-label="next"
              onClick={handleImageDelete}
            >
              <FiTrash2 />
            </IconButton>
          </Grid>
      </Grid>

      <Formik 
        enableReinitialize
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          handlePostUpdate(values)
          setSubmitting(false);
        }}
      > 
        <Form>  
          <Grid container justify="center" spacing={2}>
            {successMessage && (
              <>
                <Grid item xs={12} className={classes.successBox}>
                  <Typography variant="h6" fullLength="true" className={classes.successText}>
                    {successMessage}
                  </Typography>
                </Grid>
              </>  
              )
            }
            {errorMessage && (
              <>
                <Grid item xs={12} className={classes.errorBox}>
                  <Typography variant="h6" fullLength="true" className={classes.errorText}>
                    Error: {errorMessage}
                  </Typography>
                </Grid>
              </>  
              )
            }          

            <Grid item xs={12}>
              <TextField name="title" label="Title"/>
            </Grid>

            <Grid item xs={12}>
              <TextArea name="description" label="Description" className={classes.textArea}/>
            </Grid>

            <Grid item xs={12}>
              <TextField name="tags" label="Tags"/>
            </Grid>

            <Grid item xs={12} className={classes.checkbox}>
              <FormControlLabel control={<Checkbox name="featured" color="primary" checked={featured}/>} labelPlacement="start" label="Featured?" />
            </Grid>

            <Grid item xs={12}>
              <label for="upload-images" className={classes.label}>
                  <BurstMode color="primary" size="large" className={classes.icon}/> {uploadLabelValue}
              </label>

              <input 
                className={classes.fileInput}
                id="upload-images" 
                type="file"
                accept="image/*" 
                onChange={handleFileSelected}
                multiple
              />
            </Grid>

            <Grid container justify="center" className={classes.button}>
              <Grid item xs={6}>
                  <CustomButton >
                    Update Post
                  </CustomButton>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid container justify="center" className={classes.button}>
              <Grid item xs={4}>
                {clickedToDelete == 1
                  ? <Button fullWidth startIcon={<Error color="primary"/>} onClick={handleDeletePost}>
                    Are you Sure?
                    </Button> 
                  : <Button fullWidth startIcon={<FiTrash2 color="red"/>} onClick={handleClickedToDelete}>
                      Delete Post
                    </Button>
                }
              </Grid>
            </Grid>
      
        </Form>
        
      </Formik>
    </Grid> 
    )
  }

  return (
    <Grid container className={classes.componentGridNewPost} >

      <Grid item xs={12}>
        <Typography variant="h4" className={classes.header}>
          Portfolio Post
        </Typography>
      </Grid>

      <Formik 
        enableReinitialize
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          handlePostCreation(values)
          setSubmitting(false);
        }}
      > 
        <Form>  
          <Grid container spacing={2}>

            {successMessage && (
              <>
                <Grid item xs={12} className={classes.successBox}>
                  <Typography variant="h6" fullLength="true" className={classes.successText}>
                    {successMessage}
                  </Typography>
                </Grid>
              </>  
              )
            }

            {errorMessage && (
              <>
                <Grid item xs={12} className={classes.errorBox}>
                  <Typography variant="h6" fullLength="true" className={classes.errorText}>
                    Error: {errorMessage}
                  </Typography>
                </Grid>
              </>  
              )
            }          

            <Grid item xs={12}>
              <TextField name="title" label="Title"/>
            </Grid>

            <Grid item xs={12}>
              <TextArea name="description" label="Description" className={classes.textArea}/>
            </Grid>

            <Grid item xs={12}>
              <TextField name="tags" label="Tags"/>
            </Grid>

            <Grid item xs={4} className={classes.checkbox}>
              <FormControlLabel control={<Checkbox name="featured" color="primary" checked={featured}/>} labelPlacement="start" label="Featured?" />
            </Grid>

            <Grid item xs={12}>
              <label for="upload-images" className={classes.label}>
                  <BurstMode color="primary" size="large" className={classes.icon}/> {uploadLabelValue}
              </label>

              <input 
                className={classes.fileInput}
                id="upload-images" 
                type="file"
                accept="image/*" 
                onChange={handleFileSelected}
                multiple
              />
            </Grid>

            <Grid container spacing={3} justify="center" className={classes.button}>
              <Grid item xs={6}>
                <CustomButton >
                  Create Post
                </CustomButton>
              </Grid>
            </Grid>

          </Grid>
      
        </Form>
        
      </Formik>
    </Grid> 
  )
}