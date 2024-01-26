import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSpotDetails, spotUpdate } from "../../store/spots";
import "./UpdateSpot.css";

function UpdateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();

  const spot = useSelector((state) => state.spots.currSpot);

  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  const [lat, setLat] = useState(spot.lat);
  const [lng, setLng] = useState(spot.lng);
  const [description, setDescription] = useState(spot.description);
  const [name, setName] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);
  const [prevImg, setPrevImg] = useState(spot.previewImage || "");
  const [imgTwo, setImgTwo] = useState(spot.imgTwo || "");
  const [imgThree, setImgThree] = useState(spot.imgThree || "");
  const [imgFour, setImgFour] = useState(spot.imgFour || "");
  const [imgFive, setImgFive] = useState(spot.imgFive || "");
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
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot.SpotImages) {
      setCountry(spot.country || "");
      setAddress(spot.address || "");
      setCity(spot.city || "");
      setState(spot.state || "");
      setLat(spot.lat || 0);
      setLng(spot.lng || 0);
      setDescription(spot.description || "");
      setName(spot.name || "");
      setPrice(spot.price || "");
      setPrevImg(spot?.SpotImages[0]?.url || "");
      setImgTwo(spot.SpotImages[1]?.url || "");
      setImgThree(spot.SpotImages[2]?.url || "");
      setImgFour(spot.SpotImages[3]?.url || "");
      setImgFive(spot.SpotImages[4]?.url || "");
    }
  }, [spot]);

  function validateInputs() {
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
    // console.log(errs);
    setErrors(errs);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    // console.log("handleUpdate is running");
    if (!errors.length) {
      const updatedSpot = {
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

      const res = await dispatch(spotUpdate(updatedSpot, spot.id));
      // console.log(res);

      if (res) {
        navigate(`/spots/${res.id}`);
      } else {
        const errs = await res.json();
        return errs;
      }
    }
  };

  return (
    <div>
      <form className="update-spot-form" onSubmit={handleUpdate}>
        <div>
          <div>
            <h1>Update a Spot</h1>
            <h2>Wheres your place located?</h2>
            <p>
              Guests will only get your exact address once they booked a
              reservation
            </p>
          </div>
          <label>
            <div>
              <p className="location-inputs">Country</p>
              <p className="error">
                {errors.find((error) => error && error.includes("Country"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="Country"
              className="input-update"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            ></input>
          </label>
          <label>
            <div>
              <p className="location-inputs">Address</p>
              <p className="error">
                {errors.find((error) => error.includes("Address"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="Address"
              className="input-update"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></input>
          </label>
          <label className="city-state">
            <div>
              <p className="location-inputs">City</p>
              <p className="error">
                {errors.find((error) => error.includes("Address"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="City"
              className="input-update"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></input>
            <div>
              <p className="location-inputs">State</p>
              <p className="error">
                {errors.find((error) => error.includes("Address"))}
              </p>
            </div>

            <input
              type="text"
              placeholder="State"
              className="input-update"
              value={state}
              onChange={(e) => setState(e.target.value)}
            ></input>
          </label>
          <label className="lat-lng">
            <div>
              <p className="location-inputs">Latitude</p>
              <p className="error">
                {errors.find((error) => error.includes("Latitude"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="Latitude"
              className="input-update"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            ></input>
            <div>
              <p className="location-inputs">Longitude</p>
              <p className="error">
                {errors.find((error) => error.includes("Longitude"))}
              </p>
            </div>
            <input
              type="text"
              placeholder="Longitude"
              className="input-update"
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
          <div>
            <p className="location-inputs">Description</p>
            <p className="error">
              {errors.find((error) => error.includes("Description"))}
            </p>
          </div>
          <textarea
            type="textarea"
            placeholder="Please write at least 30 characters"
            className="description-update input-update"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="title-box">
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests attention with a spot title that highlights what makes
            your place special.
          </p>
          <div>
            <p className="location-inputs">Title</p>
            <p className="error">
              {errors.find((error) => error.includes("Title"))}
            </p>
          </div>
          <input
            type="text"
            placeholder="Name of your spot"
            className="input-update"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="price-box">
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div>
            <p className="location-inputs">Price</p>
            <p className="error">
              {errors.find((error) => error.includes("Price"))}
            </p>
          </div>
          <div className="price-div">
            ${" "}
            <input
              type="text"
              placeholder="Price per night(USD)"
              className="price-input input-update"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="update-imgs">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot</p>
          <div>
            <p className="location-inputs">Preview Image</p>
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
            className="input-update"
            value={prevImg}
            onChange={(e) => setPrevImg(e.target.value)}
          ></input>
          <p className="location-inputs">Image 1</p>
          <input
            type="text"
            placeholder="Image URL"
            className="input-update"
            value={imgTwo}
            onChange={(e) => setImgTwo(e.target.value)}
          ></input>
          <p className="location-inputs">Image 2</p>
          <input
            type="text"
            placeholder="Image URL"
            className="input-update"
            value={imgThree}
            onChange={(e) => setImgThree(e.target.value)}
          ></input>
          <p className="location-inputs">Image 3</p>
          <input
            type="text"
            placeholder="Image URL"
            className="input-update"
            value={imgFour}
            onChange={(e) => setImgFour(e.target.value)}
          ></input>
          <p className="location-inputs">Image 4</p>
          <input
            type="text"
            placeholder="Image URL"
            className="input-update"
            value={imgFive}
            onChange={(e) => setImgFive(e.target.value)}
          ></input>
        </div>
        <div>
          <button type="submit" className="uas" onClick={validateInputs}>
            Update Spot
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateSpot;
