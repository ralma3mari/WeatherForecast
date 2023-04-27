import React, { useEffect, useState } from "react";
import '../Styles/DisplayCard.css'
import { FaStar } from 'react-icons/fa';
import { MdAccountBalance } from 'react-icons/md';
import parse from 'html-react-parser';

const DisplayCard = ({data,mapping, myLocation}) => {
    const {dist,name,kinds,xid} = data.properties
    const [values,setValues] = useState({
        distance:null,
        name:name,
        kinds:kinds,
        xid:xid,
        image:null,
        address:null,
        description:null,
        popularity:null,
        coords:null
    });
    const excludedKeys = ['country_code','country'];
    

    useEffect(()=>{
        const fetchInfo = async () => {
            const xidAPI = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${process.env.REACT_APP_OPENTRIP_KEY}`
            const res = await fetch(xidAPI);
            if(res.ok){
                const data = await res.json();
                if(data.point){
                    setValues((prevValues) => ({ ...prevValues, coords: data.point }))
                } else {
                    setValues((prevValues) => ({ ...prevValues, coords: null }))
                }
                if(data.address){
                    setValues((prevValues) => ({ ...prevValues,address:data.address}))
                } else {
                    setValues((prevValues) => ({ ...prevValues, address: null }))
                }
                if(data.wikipedia_extracts && data.wikipedia_extracts.text){
                    setValues((prevValues) => ({ ...prevValues, description:data.wikipedia_extracts.html}))
                } else {
                    setValues((prevValues) => ({ ...prevValues, description: null }))
                }
                if(data.preview && data.preview.source){
                    setValues((prevValues) => ({ ...prevValues,image:data.preview.source}))
                } else {
                    setValues((prevValues) => ({ ...prevValues, image: null }))
                }
                if(data.rate){
                    const rating = parseInt(data.rate.charAt(0));
                    const isCulturalHeritage = data.rate.endsWith('h');
                    let icon = null;
                    switch (rating) {
                        case 1:
                            icon = (<FaStar />);
                            break;
                        case 2:
                            icon = (<><FaStar /><FaStar /></>);
                            break;
                        case 3:
                            icon = (<><FaStar /><FaStar /><FaStar /></>);
                            break;
                        default:
                            break;
                    }
                    if(icon){
                       setValues((prevValues) => ({ ...prevValues,popularity:{stars:icon,heritage:isCulturalHeritage?<MdAccountBalance/>:<></>}}))
                    } else {
                        setValues((prevValues) => ({ ...prevValues, popularity: null }))
                    }
                }
                if (dist) {
                    setValues((prevValues) => ({ ...prevValues, distance: dist }))
                } else {
                    setValues((prevValues) => ({ ...prevValues, distance: null }))
                }
                if (dist) {
                    setValues((prevValues) => ({ ...prevValues, name: name }))
                } else {
                    setValues((prevValues) => ({ ...prevValues, name: null }))
                }
                if (kinds) {
                    setValues((prevValues) => ({ ...prevValues, kinds: kinds }))
                } else {
                    setValues((prevValues) => ({ ...prevValues, kinds: null }))
                }
                if (xid) {
                    setValues((prevValues) => ({ ...prevValues, xid: xid }))
                } else {
                    setValues((prevValues) => ({ ...prevValues, xid: null }))
                }

            }
        }
        fetchInfo()

    },[xid,dist,kinds,name])

    return (
            <div className="displayCard">
                {values.name && <div className="name">{name}</div>}
                {values.image && <img className="imageDisplay" src={values.image} alt="Display"/>}
                {values.description && (
                    <div className="col">
                        <div className="label">
                            Description
                        </div>
                        <div className="value">
                            {parse(values.description)}
                        </div>
                    </div>
                )}
                {values.address && (
                    <div className="address">
                        <div className="address-label">
                            Address:
                        </div>
                        <table className="address-table">
                            <tbody>
                                {Object.keys(values.address).map((key,index) => {
                                    if (!excludedKeys.includes(key)) {
                                        
                                        return (
                                            <tr className="address-row" key={index}>
                                                <td className="address-key">{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}:</td>
                                                <td className="address-value">{values.address[key]}</td>
                                            </tr>
                                        )
                                    } else {
                                        return (
                                            <React.Fragment key={index}></React.Fragment>
                                        )
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>

                )}
                {values.distance && myLocation && (
                    <div className="row">
                        <div className="label">
                        Distance:
                        </div>
                        <div className="value">
                            {dist.toFixed(2)} m
                        </div>
                    </div>
                )}
                {values.kinds && (
                    <div className="row">
                        <div className="label">
                            Kinds:
                        </div>
                        <div className="value kindMapping">
                            {values.kinds.split(",").filter(kind => mapping.includes(kind)).map((kind, index) =>
                                <div className="kind" key={index}>{kind.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                            )}
                        </div>
                    </div>
                )}
                {values.popularity && (
                    <div className="row">
                        <div className="label">
                            Popularity:
                        </div>
                        <div className="value">
                            {values.popularity.stars}  {values.popularity.heritage}
                        </div>
                    </div>
                )}
                {values.coords && (
                    <a rel="noreferrer" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${values.coords.lat},${values.coords.lon}`}>Open in Google Maps</a>
                )}
            </div>
    )
}
export default DisplayCard;