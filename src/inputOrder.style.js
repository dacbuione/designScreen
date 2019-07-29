import { StyleSheet } from 'react-native';
import Colors from '../../common/Styles/Colors';
import Layout from '../../common/Styles/Layout';

export default StyleSheet.create({
    container:{
        flex:1,
    },
    groupContent:{
        padding:15
    },
    row:{
        flexDirection:'row',
        marginBottom:15,
    },
    formGroup:{
        position:'relative',
        flex:1,
    },
    formGroupIcon:{
        position:'absolute',
        right:0,
        top:10,
        width:16,
        height:16,
        zIndex:2
    },
    textInput:{
        paddingLeft: 0
    },
    touchableRow:{
        padding:10,
    },
    footerButton:{
        width:150
    },totalVal:{
        marginLeft:10,
        paddingBottom:5,
        borderBottomColor:'#ddd',
        borderBottomWidth:1,
        width:100,
    }
})