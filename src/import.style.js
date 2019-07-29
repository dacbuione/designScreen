import { StyleSheet } from 'react-native';
// import Colors from '../../common/Styles/Colors';
// import Layout from '../../common/Styles/Layout';

export default StyleSheet.create({
    container:{
        padding:15,
    },
    item:{
        position:'relative',
        paddingVertical:10,
        borderBottomWidth:1,
        borderBottomColor:'#eee'
    },
    date:{
        position:'absolute',
        right:0,
        top:10,
        color:'#999',
        fontSize:12
    },
    button1 : {
        //backgroundColor: "#d22",
        height: 90,
      },
      swipeable: {
        width: '100%',
        height: 100,
        backgroundColor: "#fff",
        marginLeft:15
      },
    row:{
        flexDirection:'row',
        marginBottom:15,
    },
    formGroup:{
        position:'relative',
        flex:1,
        padding: 10,
    },
    formGroupIcon:{
        position:'absolute',
        right:0,
        top:10,
        width:16,
        height:16,
        zIndex:2
    },
})