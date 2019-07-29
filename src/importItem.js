import React, {Component} from 'react';
import {View, Text,TouchableOpacity} from 'react-native';
import styles from './import.style'
export default class ImportItem extends Component{
    render(){
        var {data} = this.props;
        return(
            
            <View style={styles.item}>
                <Text style={{fontWeight:'bold'}}>
                   Đơn vị nhập: {data.ma_dvcs} 
                </Text>
                <Text>
                    Khách: {data.ma_kh} - {data.ten_kh}
                </Text>
                <Text>
                    Tiền: {data.t_tien} {data.ma_nt}
                </Text>
                <Text>
                    Diễn giải: ...
                    {/* {data.dien_giai} */}
                </Text>
                <Text style={styles.date}>
                    {data.ngay_ct}
                </Text>
            </View>

        )
    }
}