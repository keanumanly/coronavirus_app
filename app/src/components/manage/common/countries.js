import React, { useReducer } from "react";
import { CountryData } from "../../actions/Api";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    margin: "1% auto"
  },
  container: {
    maxHeight: 600
  },
  formControl: {
    marginLeft: "1%",
    minWidth: 250
  },
  searchstyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    "@media (max-width: 425px)": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  },
  fontstyling: {
    fontWeight: 550,
    textTransform: "capitalize",
    "@media (max-width: 425px)": {
      fontSize: "16px",
    }
  }
}));

function reducer(state, action) {
  switch (action.type) {
    case "loaded": {
      return {
        ...state,
        iserror: false,
        confirmed: action.confirmed,
        recovered: action.recovered,
        deaths: action.deaths,
        country: action.country
      };
    }
    case "search": {
      return {
        ...state,
        isloading: false,
        searhval: action.item
      };
    }
    case "error": {
      return {
        ...state,
        iserror: true,
        erroval: "",
        confirmed: 0,
        recovered: 0,
        deaths: 0,
        country: "No Data found"
      };
    }
    case "error-fetch": {
      return {
        ...state,
        iserror: false,
        erroval: action.payloads,
        confirmed: 0,
        recovered: 0,
        deaths: 0,
        country: "No Data found"
      };
    }
    default:
      break;
  }
  return state;
}

const InitialState = {
  searhval: "",
  iserror: false,
  erroval: "",
  confirmed: "",
  recovered: "",
  deaths: "",
  country: ""
};

export default function CountriesData(props) {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, InitialState);
  const {
    searhval,
    iserror,
    erroval,
    confirmed,
    recovered,
    deaths,
    country
  } = state;

  const onSearch = async e => {
    e.preventDefault();
    if (searhval) {
      const Loaddata = async () => {
        await CountryData(searhval)
          .then(res => {
            // console.log(res.data);
            dispatch({
              type: "loaded",
              confirmed: res.data.confirmed.value,
              recovered: res.data.recovered.value,
              deaths: res.data.deaths.value,
              country: searhval
            });
          })
          .catch(err =>
            dispatch({
              type: "error-fetch",
              payloads: err.response.data.error.message
            })
          );
      };
      Loaddata();
    } else {
      // console.log(true);
      dispatch({ type: "error" });
    }
  };
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <div style={{ display: "flex", paddingLeft: "1%", paddingRight: "1%" }}>
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={e => onSearch(e)}
          >
            <TextField
              id="standard-search"
              placeholder="Search Country ... e.g.Philippines"
              fullWidth
              onChange={e =>
                dispatch({
                  type: "search",
                  name: "general_info",
                  item: e.target.value
                })
              }
            />
          </form>
        </div>
        {iserror ? (
          <FormHelperText
            id="component-helper-text"
            style={{ marginLeft: "1%", fontWeight: 500 }}
          >
            {erroval ? erroval : "Invalid Null Value"}
          </FormHelperText>
        ) : (
          <FormHelperText
            id="component-helper-text"
            style={{ marginLeft: "1%", fontWeight: 500 }}
          >
            {erroval}
          </FormHelperText>
        )}
        <div className={classes.searchstyle}>
          <Typography
            variant="h6"
            component="h2"
            style={{
              color: "black",
              padding: "1%",
              fontWeight: 500
            }}
          >
            Country:{" "}
            <span className={classes.fontstyling}>
              {country}
            </span>
          </Typography>

          <Typography
            variant="h6"
            component="h2"
            style={{
              color: "black",
              padding: "1%",
              fontWeight: 500
            }}
          >
            Confirmed Cases:{" "}
            <span  className={classes.fontstyling} style={{ color: "#0080FF"}}>
              {confirmed}
            </span>
          </Typography>

          <Typography
            variant="h6"
            component="h2"
            style={{
              color: "black",
              padding: "1%",
              fontWeight: 500
            }}
          >
            Recovered:{" "}
            <span className={classes.fontstyling} style={{ color: "#00A572"}}>
              {recovered}
            </span>
          </Typography>

          <Typography
            variant="h6"
            component="h2"
            style={{
              color: "black",
              padding: "1%",
              fontWeight: 500
            }}
          >
            Deaths:{" "}
            <span className={classes.fontstyling}  style={{ color: "#D21F3C"}}>{deaths}</span>
          </Typography>
        </div>
      </Paper>
    </React.Fragment>
  );
}
