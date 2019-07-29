import React, { Component } from 'react';
import {
    View,
    DatePicker,
} from 'react-native';
import {Icon} from 'expo';
import styles from '../import.style';


export class infoCustomerCard extends React.Component {  

    render(){
        return(
            <View>
            <View style={styles.row}>
                    <View style={styles.formGroup}>
                         <DatePicker
                            date={this.state.date1}
                            mode="date"
                            placeholder="Từ ngày"
                            format="DD/MM/YYYY"
                            confirmBtnText="Ok"
                            cancelBtnText="Hủy"
                            iconComponent={<Icon.Feather name="calendar" size={16} color="#999" style={{
                                position: 'absolute', right: 0,
                                top: 5
                            }} />}
                            style={[{
                                width: '100%',paddingLeft: '10%'
                            },styles.textInput]}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0,
                                    alignItems: 'flex-start',
                                    paddingBottom: 10
                                }
                            }}
                            onDateChange={(date) => { this._onChaneDate1(date) }}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <DatePicker
                            date={this.state.date2}
                            mode="date"
                            placeholder="Đến ngày"
                            format="DD/MM/YYYY"
                            confirmBtnText="Ok"
                            cancelBtnText="Hủy"
                            iconComponent={<Icon.Feather name="calendar" size={16} color="#999" style={{
                                position: 'absolute', right: 0,
                                top: 5
                            }} />}
                            style={[{
                                width: '100%', paddingLeft: 20
                            },  styles.textInput]}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0,
                                    alignItems: 'flex-start',
                                    paddingBottom: 10
                                }
                            }}
                            onDateChange={(date) => { this._onChaneDate2(date) }}
                        />
                    </View >
                </View>
                <View>
                    <View style={[styles.formGroup]}>
                        <TextInput style={[ styles.textInput]}
                            underlineColorAndroid="transparent"
                            placeholder="Mã hàng"
                            value={this.state.itemCode}
                        />
                        <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.setState({ itemModalVisible: true })}>
                            <Image source={require('../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                    {/* <SeachBox placeholder="Nhập thông tin cần tìm" style={{}} onSearch={this._onSearch} /> */}
                    {/* <Text style = {{fontWeight: 'bold', flex: 1}}>Tổng số kết quả: {this.state.count}</Text> */}
                    {/* <View style={commonStyles.btnRow}>
                    <SubmitButton style={[commonStyles.primaryButton, styles.footerButton]} caption="Lọc" textStyles={commonStyles.primaryButtonText} onPress={() => alert('click')} />
                    </View> */}
            </View>
        );
    }
}
export default infoCustomerCard;