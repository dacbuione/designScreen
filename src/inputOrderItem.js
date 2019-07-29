import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './import.style'
export default class InputOrderItem extends Component{
    render(){
        var {data} = this.props;
        return(
            <View style={styles.item}>
                <Text style={{fontWeight:'bold'}}>
                   {data.ma_vt} - {data.ten_vt} 
                </Text>
                <Text>
                    Kho: {data.ma_kho}/ vị trí: {data.ma_vi_tri}/ lô: {data.ma_lo}
                </Text>
                <Text>
                    Số lượng: {data.so_luong}/ giá: {data.gia}/ tiền:  {data.tien}
                </Text>
                <Text>
                    Don vi tinh: {data.dvt}
                </Text>
            </View>
        )
    }
}