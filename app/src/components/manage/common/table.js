import React, { useEffect, useReducer } from "react";
import { General_Info, Confirmed_Cases } from "../../actions/Api";
import { CircleLoading } from "react-loadingg";
import TableData from "./tabledata";
import CountriesData from "./countries";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: "5%"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  cases: {
    fontWeight: 550,
    fontSize: "20px",
    "@media (max-width: 425px)": {
      fontSize: "15px",
    }
  }
}));

function reducer(state, action) {
  switch (action.type) {
    case "load": {
      return {
        ...state,
        isloading: true
      };
    }
    case "loaded": {
      return {
        ...state,
        confirmed: action.confirmed,
        recovered: action.recovered,
        deaths: action.deaths
      };
    }
    case "loaded2": {
      return {
        ...state,
        isloading: false,
        list: action.item
      };
    }
    default:
      break;
  }
  return state;
}
const InitialState = {
  isloading: false,
  confirmed: null,
  recovered: null,
  deaths: null,
  list: []
};
export default function Tablelist(props) {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, InitialState);
  const { list, confirmed, recovered, deaths, isloading } = state;
  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      dispatch({ type: "load" });
      const Loaddata = async () => {
        await General_Info()
          .then(res => {
            // console.log(res.data);
            dispatch({
              type: "loaded",
              name: "general_info",
              confirmed: res.data.confirmed,
              recovered: res.data.recovered,
              deaths: res.data.deaths
            });
          })
          .catch(err => console.log(err));

        await Confirmed_Cases()
          .then(res => {
            // console.log(res.data);
            dispatch({
              type: "loaded2",
              name: "confirmed_cases",
              item: res.data
            });
          })
          .catch(err => console.log(err));
      };
      Loaddata();
    }
    return () => {
      console.log("unmounted");
      isSubscribed = false;
    };
  }, []);
  return (
    <React.Fragment>
      {isloading ? (
        <CircleLoading />
      ) : (
        <div>
          <CssBaseline />
          <Container maxWidth="lg">
            <div
              style={{
                marginTop: "5%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Paper
                style={{
                  width: "30%",
                  height: "80px",
                  textAlign: "center",
                  backgroundColor: "#0080FF",
                  color: "white",
                  padding: "1%"
                }}
              >
                <span className={classes.cases}>
                  {confirmed ? confirmed.value : "0"}
                </span>
                <br />
                <span className={classes.cases}>Confirmed Case</span>
              </Paper>
              <Paper
                style={{
                  width: "30%",
                  height: "80px",
                  textAlign: "center",
                  backgroundColor: "#00A572",
                  color: "white",
                  padding: "1%"
                }}
              >
                <span className={classes.cases}>
                  {recovered ? recovered.value : "0"}
                </span>
                <br />
                <span className={classes.cases}>
                  Recovered Case
                </span>
              </Paper>
              <Paper
                style={{
                  width: "30%",
                  height: "80px",
                  textAlign: "center",
                  backgroundColor: "#D21F3C",
                  color: "white",
                  padding: "1%"
                }}
              >
                <span className={classes.cases}>
                  {deaths ? deaths.value : "0"}
                </span>
                <br />
                <span className={classes.cases}>
                  Deaths Case
                </span>
              </Paper>
            </div>
            <CountriesData />
            <Card
              style={{
                marginTop: "3%"
              }}
            >
              <div
                style={{
                  marginTop: "1%",
                  marginBottom: "3%",
                  marginLeft: "1%"
                }}
              >
                <Typography
                  variant="subtitle1"
                  component="h2"
                  style={{
                    color: "black",
                    fontWeight: 550
                  }}
                >
                  DATA INFORMATION
                </Typography>
                <Typography
                  variant="body2"
                  component="span"
                  style={{
                    color: "black",
                    fontWeight: 500
                  }}
                >
                  Important Details of Cases of NCOV19 ( Coronavirus Disease )
                </Typography>
                <br />
                <span>
                  Click Here for{" "}
                  <Link
                    component="button"
                    variant="body2"
                    color="primary"
                    onClick={() => props.history.push("/daily-update")}
                  >
                    Daily Update
                  </Link>
                </span>
                <br />
                <span>
                  Click Here for more{" "}
                  <Link
                    component="button"
                    variant="body2"
                    color="primary"
                    onClick={() => props.history.push("/coronavirus-pandemic")}
                  >
                    Visuals Map
                  </Link>
                </span>
              </div>
              <div style={{ padding: "1%" }}>
                <TableData data={list} />
              </div>
            </Card>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
}
