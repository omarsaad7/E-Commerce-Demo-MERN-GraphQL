import React, { Component } from 'react'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import backendUrls from '../General/StaticVariables/backEndUrls.json'
import { ToastContainer, toast } from 'react-toastify'
import LoadingIcon from '../General/Loading.js'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Button } from 'react-bootstrap'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import uri from '../General/StaticVariables/uri.json'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}))

const titleMenuColor = '#353A40'
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
})
export default class AllOrders extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      orders: [],
      ordersTotalCount:0,
      error:false,
      status:'ALL',
      page:0,
      rowsPerPage:5
      
    }
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) })
    this.getItems(parseInt(event.target.value, 10), 0,this.state.status)
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
    this.getItems(this.state.rowsPerPage, newPage,this.state.status)
  }

  async getItems(rowsPerPage, page, status){
    this.setState({ loading: true })
    const headers = {
      Authorization: localStorage.getItem('token'),
    }
    var statusQuery=''
    if(status && status!=='ALL')
      statusQuery = `&status=${status}`
    var query = `?limit=${rowsPerPage}&page=${page+1}${statusQuery}`
    await axios
      .get(
        backendUrls.host + backendUrls.order.baseUri + backendUrls.order.api.getUserOrders + query,{
          headers: headers,
        }
      )
      .then((response) => {
        
        console.log(response)
          this.setState({
            orders: response.data.data,
            ordersTotalCount: response.data.totalSize,
            loading: false
          })
      })
      .catch((error) => {
        if(error.response && error.response.data && error.response.data.error)
          toast.error(error.response.data.error)
         else
          toast.error(staticVariables.messages.somethingWrong)
        this.setState({ loading: false, error: true })
      })
  }


  getBadgeColor(status){
    switch (status)
{
   case "PENDING": 
   case "PAYMENTPROCESSING": return '#FFBF00'
   case "PAYMENTFAILED": return '#ff0000'
   case "PAID": return '#00ff00'
   default: return '#FFBF00'
}
  }

  async componentDidMount() {
    this.getItems(this.state.rowsPerPage,this.state.page,this.state.status)
  }

  itemPrice(priceInCents){
    var priceInDollars = priceInCents/100
    return priceInDollars.toFixed(2)
  }


  loading() {
    return (
      <>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHeader />
          </Table>
        </TableContainer>
        <br />
        <LoadingIcon type="spin" color="#5bc0de" />
      </>
    )
  }

  Error(msg) {
    return (
      <>
      <label>Filter by Order Status</label>
        <DropdownButton id="dropdown-basic-button" title={this.state.status}>
      <Dropdown.Item onClick={(e) => this.handleStatus('PENDING')}>PENDING</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleStatus('PAYMENTPROCESSING')}>PAYMENTPROCESSING</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleStatus('PAYMENTFAILED')}>PAYMENTFAILED</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleStatus('PAID')}>PAID</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleStatus('ALL')}>ALL</Dropdown.Item>
      </DropdownButton> 
      <br/>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHeader />
          </Table>
        </TableContainer>
        <br />
        <div style={{ paddingLeft: '10ex' }}>
          <br />
          <br />
          <br />
          {msg}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </>
    )
  }

  handleStatus(status){
    this.setState({ status: status })
    this.getItems(this.state.rowsPerPage, 0,status)
  }
  render() {
    if (this.state.loading) {
      return this.loading()
    } else if (this.state.orders.length===0) {
      return this.Error(
        staticVariables.messages.noOrdersTOShow
      )
    } else if (this.state.error) {
      return this.Error(staticVariables.messages.somethingWrong)
    } else {
      return (
        <>
        <label>Filter by Order Status</label>
        <DropdownButton id="dropdown-basic-button" title={this.state.status}>
      <Dropdown.Item onClick={(e) => this.handleStatus('PENDING')}>PENDING</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleStatus('PAYMENTPROCESSING')}>PAYMENTPROCESSING</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleStatus('PAYMENTFAILED')}>PAYMENTFAILED</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleStatus('PAID')}>PAID</Dropdown.Item>
      <Dropdown.Item onClick={(e) => this.handleStatus('ALL')}>ALL</Dropdown.Item>
      </DropdownButton> 
    <br/>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHeader />
              <TableBody>
                {this.state.orders.map((order) => (
                  <Row
                    row={order}
                    priceMethod={this.itemPrice}
                    badgeColor={this.getBadgeColor}
                  />
                ))}
              </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      colSpan={5}
                      count={this.state.ordersTotalCount}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
            </Table>
          </TableContainer>

          <br />
        </>
      )
    }
  }
}




function TableHeader() {
  return (
    <TableHead>
      <TableRow style={{ backgroundColor: titleMenuColor }}>
        <TableCell style={{ color: 'white' }}>
          <b>Date-Time</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>Total Price</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>Status</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>Receipt</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>View Order</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center"></TableCell>
      </TableRow>
    </TableHead>
  )
}



function TablePaginationActions(props) {
  const classes = useStyles1()
  const theme = useTheme()
  const { count, page, rowsPerPage, onChangePage } = props

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  )
}



function Row(props) {
  const { row, priceMethod, badgeColor } = props
  const [open, setOpen] = React.useState(false)
  const classes = useRowStyles()
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell component="th" scope="row">
          {row.createdAt}
        </TableCell>
        {/* <TableCell align="center">{row._id}</TableCell> */}
        <TableCell align="center">
          {priceMethod(row.totalPrice)}$
        </TableCell>
        <TableCell align="center" style={{color:badgeColor(row.status)}}>
        {row.status}
        </TableCell>
        <TableCell align="center">
          {row.receiptUrl?<a href={row.receiptUrl} target="_blank">Receipt</a>:<>Payment Success required to view receipt</>}
        </TableCell>
        <TableCell align="center">
        <a href={uri.order.replace(':id',row._id)} target="_blank">Details</a>
        </TableCell>
      </TableRow>
      
    </React.Fragment>
  )
}
