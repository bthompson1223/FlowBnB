import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createNewSpot,
  fetchAllSpots,
  newSpotImage,
  fetchSpotDetails,
} from "../../store/spots";

import "./CreateSpot.css";

function CreateSpot() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [prevImg, setPrevImg] = useState("");
  const [imgTwo, setImgTwo] = useState("");
  const [imgThree, setImgThree] = useState("");
  const [imgFour, setImgFour] = useState("");
  const [imgFive, setImgFive] = useState("");
  const [errors, setErrors] = useState([]);
  const allowedExtentions = [".jpg", ".jpeg", ".png"];
  const errs = [];
  const imgs = [];
  if (prevImg) imgs.push(prevImg);
  if (imgTwo) imgs.push(imgTwo);
  if (imgThree) imgs.push(imgThree);
  if (imgFour) imgs.push(imgFour);
  if (imgFive) imgs.push(imgFive);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch, user]);

  function validateInputs() {
    // console.log("Validate is running");
    if (!country) errs.push("Country is required");
    if (!address) errs.push("Address is required");
    if (!city) errs.push("City is required");
    if (!state) errs.push("State is required");
    if (lat < -90 || lat > 90 || !lat) errs.push("Valid Latitude is required");
    if (lng < -180 || lng > 180 || !lat)
      errs.push("Valid Longitude is required");
    if (description.length < 30)
      errs.push("Description must be at least 30 characters");
    if (!name) errs.push("Title is required");
    if (!price) errs.push("Price is required");
    if (!prevImg) errs.push("Preview image is required");
    for (let i = 0; i < imgs.length; i++) {
      const lowerImg = imgs[i].toLowerCase();
      let validExt = false;
      for (let j = 0; j < allowedExtentions.length; j++) {
        const ext = allowedExtentions[j];
        if (lowerImg.endsWith(ext)) {
          validExt = true;
          break;
        }
      }
      if (!validExt) errs.push("Image must have a valid extension");
    }
    setErrors(errs);
    // console.log(errors);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("handle submit is running");
    const spot = {
      ownerId: user.id,
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    };

    const priceTest = spot.price.split(".");
    if (!priceTest[1]) spot.price = parseFloat(`${spot.price}`);
    // console.log("Price test", priceTest);
    // console.log("Spot price", spot.price);
    // console.log("This is the spot: ", spot);
    const previewImg = {
      url: prevImg,
      preview: true,
    };
    // console.log(errors);
    if (!errors.length) {
      // console.log("preres");
      const res = await dispatch(createNewSpot(spot));
      // console.log("inside if statement");
      if (res) dispatch(newSpotImage(previewImg, res.id));
      // console.log("res spot", res);

      if (imgTwo) {
        const newImg = {
          url: imgTwo,
          preview: false,
        };
        dispatch(newSpotImage(newImg, res.id));
      }
      if (imgThree) {
        const newImg = {
          url: imgThree,
          preview: false,
        };
        dispatch(newSpotImage(newImg, res.id));
      }
      if (imgFour) {
        const newImg = {
          url: imgFour,
          preview: false,
        };
        dispatch(newSpotImage(newImg, res.id));
      }
      if (imgFive) {
        const newImg = {
          url: imgFive,
          preview: false,
        };
        dispatch(newSpotImage(newImg, res.id));
      }

      // console.log("Spot post imgs: ", spot);
      // console.log("prenav");
      dispatch(fetchSpotDetails(res.id));
      navigate(`/spots/${res.id}`);

      setCountry("");
      setAddress("");
      setCity("");
      setState("");
      setLat("");
      setLng("");
      setDescription("");
      setName("");
      setPrice("");
      setPrevImg("");
      setImgTwo("");
      setImgThree("");
      setImgFour("");
      setImgFive("");
    }
  };

  return (
    <div>
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <div>
          <div>
            <h1>Create A Spot</h1>
            <h2>Wheres your place located?</h2>
            <p>
              Guests will only get your exact address once they booked a
              reservation
            </p>
          </div>
          <label>
            <div className="title-errors">
              <p className="locaInputs">Country</p>
              <p className="error">
                {errors.find((error) => error && error.includes("Country"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="Country"
              className="country input-create"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            ></input>
          </label>
          <label>
            <div className="title-errors">
              <p className="locaInputs">Address</p>
              <p className="error">
                {errors.find((error) => error.includes("Address"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="Address"
              className="address input-create"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></input>
          </label>
          <label className="citystate">
            <div className="title-errors">
              <p className="locaInputs">City</p>
              <p className="error">
                {errors.find((error) => error.includes("Address"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="City"
              className="city input-create"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></input>
            <div className="title-errors">
              <p className="locaInputs">State</p>
              <p className="error">
                {errors.find((error) => error.includes("Address"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="State"
              className="state input-create"
              value={state}
              onChange={(e) => setState(e.target.value)}
            ></input>
          </label>
          <label className="latlng">
            <div className="title-errors">
              <p className="locaInputs">Latitude</p>
              <p className="error">
                {errors.find((error) => error.includes("Latitude"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="Latitude"
              className="lat input-create"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            ></input>
            <div className="title-errors">
              <p className="locaInputs">Longitude</p>
              <p className="error">
                {errors.find((error) => error.includes("Longitude"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="Longitude"
              className="lng input-create"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            ></input>
          </label>
        </div>
        <div className="descriptionBox">
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood
          </p>
          <div className="title-errors">
            <p className="locaInputs">Description</p>
            <p className="error">
              {errors.find((error) => error.includes("Description"))}
            </p>
          </div>
          <textarea
            type="text"
            placeholder="Please write at least 30 characters"
            className="desc input-create"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="titleBox">
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests attention with a spot title that highlights what makes
            your place special.
          </p>
          <div className="title-errors">
            <p className="locaInputs">Title</p>
            <p className="error">
              {errors.find((error) => error.includes("Title"))}
            </p>
          </div>
          <input
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-create"
          ></input>
        </div>
        <div className="priceBox">
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div className="title-errors">
            <p className="locaInputs">Price</p>
            <p className="error">
              {errors.find((error) => error.includes("Price"))}
            </p>
          </div>
          <div className="price-div">
            ${" "}
            <input
              type="text"
              placeholder="Price per night(USD)"
              className="price-input input-create"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="updateImgs">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot</p>
          <div className="title-errors">
            <p className="locaInputs">Preview Image</p>
            <p className="error">
              {errors.find((error) => error.includes("Preview"))}
            </p>
            <p className="error">
              {errors.find((error) => error.includes("Image"))}
            </p>
          </div>
          <input
            type="text"
            placeholder="Preview Image URL"
            value={prevImg}
            onChange={(e) => setPrevImg(e.target.value)}
            className="input-create"
          ></input>
          <p className="locaInputs">Image 1</p>
          <input
            type="text"
            placeholder="Image URL"
            value={imgTwo}
            onChange={(e) => setImgTwo(e.target.value)}
            className="input-create"
          ></input>
          <p className="locaInputs">Image 2</p>
          <input
            type="text"
            placeholder="Image URL"
            value={imgThree}
            onChange={(e) => setImgThree(e.target.value)}
            className="input-create"
          ></input>
          <p className="locaInputs">Image 3</p>
          <input
            type="text"
            placeholder="Image URL"
            value={imgFour}
            onChange={(e) => setImgFour(e.target.value)}
            className="input-create"
          ></input>
          <p className="locaInputs">Image 4</p>
          <input
            type="text"
            placeholder="Image URL"
            value={imgFive}
            onChange={(e) => setImgFive(e.target.value)}
            className="input-create"
          ></input>
        </div>
        <div className="casButton">
          <button type="submit" className="cas" onClick={validateInputs}>
            Create Spot
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSpot;
