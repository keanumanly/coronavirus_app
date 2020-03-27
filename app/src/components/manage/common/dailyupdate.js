import React, { useEffect, useReducer } from "react";
import { DailyUpdate, FilterData } from "../../actions/Api";
import { CircleLoading } from "react-loadingg";
import SimpleBreadcrumbs from "./breadcrumbs";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    width: "98%",
    margin: "1% auto"
  },
  container: {
    maxHeight: 600,
  },
  formControl: {
    marginLeft: "1%",
    minWidth: 250
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
    case "firstload": {
      return {
        ...state,
        isocode: action.data
      };
    }
    case "loaded": {
      return {
        ...state,
        isloading: false,
        rows: action.item,
        rowsbackup: action.item
      };
    }
    case "search": {
      return {
        ...state,
        isloading: false,
        rows: action.item
      };
    }
    case "filter": {
      return {
        ...state,
        isloading: false,
        rows: action.item
      };
    }
    case "iso_code": {
      return {
        ...state,
        valcode: action.payloads
      };
    }
    default:
      break;
  }
  return state;
}

const InitialState = {
  isloading: false,
  isocode: [],
  valcode: "",
  rows: [],
  rowsbackup: [],
  columns: [
    { id: "combinedKey", label: "Name", minWidth: 170 },
    { id: "countryRegion", label: "ISO\u00a0Code", minWidth: 100 },
    {
      id: "provinceState",
      label: "Province State",
      minWidth: 170,
      align: "center",
      format: value => value.toLocaleString()
    },
    {
      id: "confirmed",
      label: "Confirmed Case",
      minWidth: 170,
      align: "center",
      format: value => value.toFixed(2)
    },
    {
      id: "recovered",
      label: "Recovered",
      minWidth: 170,
      align: "center",
      format: value => value.toFixed(2)
    },
    {
      id: "deaths",
      label: "Deaths",
      minWidth: 170,
      align: "center",
      format: value => value.toFixed(2)
    }
  ]
};

export default function TableData(props) {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, InitialState);
  const { rows, rowsbackup, isocode, valcode, columns, isloading } = state;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      dispatch({ type: "load" });
      const Loaddata = async () => {
        await FilterData().then(res => {
          dispatch({
            type: "firstload",
            name: "filter-category",
            data: res
          });
        });
        await DailyUpdate()
          .then(res => {
            // console.log(res.data);
            dispatch({
              type: "loaded",
              name: "general_info",
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

  const onSearch = async e => {
    e.preventDefault();
    const result = rows.filter(element =>
      element.combinedKey
        .toLowerCase()
        .match(e.currentTarget.value.toLowerCase())
    );
    if (result.length > 0 && e.currentTarget.value.length > 0) {
      dispatch({
        type: "search",
        name: "general_info",
        item: result
      });
    } else {
      dispatch({
        type: "search",
        name: "general_info",
        item: rowsbackup
      });
    }
  };
  const OnFilter = async e => {
    e.preventDefault();
    setPage(0);

    dispatch({
      type: "iso_code",
      payloads: e.target.value
    });
    const result = rowsbackup.filter(element =>
      element.countryRegion.toLowerCase().match(e.target.value.toLowerCase())
    );
    if (result.length > 0 && e.target.value.length > 0) {
      dispatch({
        type: "filter",
        name: "general_info",
        item: result
      });
    } else {
      dispatch({
        type: "filter",
        name: "general_info",
        item: rowsbackup
      });
    }
  };
  return (
    <React.Fragment>
      {isloading ? (
        <CircleLoading />
      ) : (
        <>
          <div style={{ margin: "1%" }}>
            <SimpleBreadcrumbs {...props} />
          </div>
          <Paper className={classes.root}>
            
              <Typography
                variant="h5"
                component="h2"
                style={{
                  textAlign: "left",
                  color: "black",
                  padding: "1%",
                  fontWeight: 600
                }}
              >
                Daily Update List
              </Typography>
            <div
              style={{ display: "flex", paddingLeft: "1%", paddingRight: "1%" }}
            >
              <TextField
                id="filled-required"
                variant="filled"
                placeholder="Search Name..."
                fullWidth
                onChange={e => onSearch(e)}
              />
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-filled-label">
                  ISO Code
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={valcode}
                  onChange={e => OnFilter(e)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {isocode.length > 0
                    ? isocode.map((element, index) => (
                        <MenuItem key={index} value={element}>
                          {element}
                        </MenuItem>
                      ))
                    : ""}
                </Select>
              </FormControl>
            </div>
            <div style={{paddingLeft:'1%',paddingRight:'1%'}}>

            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, fontWeight: 600 }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          {columns.map((column, indx) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={indx} align={column.align}>
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100, 200]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            </div>
          </Paper>
        </>
      )}
    </React.Fragment>
  );
}
