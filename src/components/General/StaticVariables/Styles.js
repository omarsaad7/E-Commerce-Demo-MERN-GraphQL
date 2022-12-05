import { getWindowSize } from '../Functions'
const screenSize = getWindowSize()

export const Styles = {
  footer: {
    flexShrink: 'none',
  },
  loading: {
    margin: 'auto',
    width: '10%',
  },
  slider: {
    position: 'absolute',
    width: '90%',
    height: '2px',
  },
  centered75: {
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  center90: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  card1: {
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#F8F9F9',
  },
  centered75: {
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  centered50: {
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  centered60: {
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  minHeight: {
    minHeight: `${screenSize.height}px`,
  },
  bgImage: {
    backgroundImage: `url(/background.jpg)`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    minHeight: `${screenSize.height}px`,
  },
  card2: {
    backgroundColor: '#479521',
    color: 'white',
  },
  card3:(bg)=> {
    return({
    backgroundColor: bg,
    color: 'white'})
  },
  sideByside: {
    // display:'inline-block',
    float: 'left',
  },
  lineSpace: {
    lineHeight: '40%',
  },
  description: {
    color: 'silver',
    fontFamily: 'courier',
  },
  right: {
    float: 'right',
    padding: '1px',
  },
  secondaryText:{
    color: 'gray', 
    // fontSize: '16px',
    paddingBottom:'0px'
  },
  analyticsCard : {
    padding: '15px',
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: 240,
  },
  analyticsEditIcon:{
    color:'black'
  }
}
