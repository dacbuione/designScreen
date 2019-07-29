import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, FlatList, AsyncStorage, Linking } from 'react-native';
import styles from './inputOrder.style'
import { Icon } from 'expo'
import { commonStyles } from '../../common/Styles/CommonStyles'
import HeaderBackButton from '../../layouts/header/buttonBack';
import Colors from '../../common/Styles/Colors'
import HeaderButton from '../../common/Buttons/HeaderButton';
import InputOrderItem from './inputOrderItem';
import SubmitButton from '../../common/Buttons/SubmitButton';
import NewInputOrderDetailContainer from '../../../core/containers/import/newInputOrderDetail.container';
import CustomerModalContainer from '../../../core/containers/modal/customerModal.container';
import DealModalContainer from '../../../core/containers/modal/dealModal.container';
import RateModalContainer from '../../../core/containers/modal/rateModal.container';
import DatePicker from 'react-native-datepicker';
import ModalPicker from '../../common/Modal/modalPicker';
import BarcodeContainer from '../../../core/containers/barcode/barcode.container';
import base64 from 'react-native-base64';
import md5 from 'md5';
import url from '../../../configs/environments/envSV';
import primaryKey from '../../../configs/environments/primaryKey'

var STORAGE_KEY = 'IP_SERVER';
const key = primaryKey;
var STORAGE_ID = 'STORAGE_ID';
const print = require('../../../assets/image/print.png');

export default class importViewDetail extends Component {
    constructor(props) {
        super(props);
        var uid = '';
        this.state = {
            data: [],
            date: null,
            status: '',
            customer: '',
            deal: '',
            idCustomer: '',
            nguoiGiao: '',
            idDeal: '',
            dienGiai: '',
            soPhieuNhap: '',
            param: [
                {
                    UserId: uid,
                    FastID: this.props.navigation.getParam('key')
                }
            ]
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: Colors.mainColor,
            },
            title: 'Xem Phiếu Nhập',
            headerTitleStyle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
            headerLeft: <HeaderBackButton navigation = {navigation}/>,
            headerRight: <TouchableOpacity onPress={()=> params._getPrint()} style={commonStyles.mr15}><Image source={print} style={{width:22,height:22,resizeMode:'contain'}}/></TouchableOpacity>,
        }
    };
    isLogin= async() => {
        await AsyncStorage.getItem(STORAGE_ID).then((userId) => {
            var id = userId;
            this.uid = parseInt(id);
        })
        return this.uid;
    }
    _getPrint = () => {
        var param = [{UserId: this.uid,FastID: this.props.navigation.getParam('key') }]
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            var db = base64.encode(JSON.stringify(param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('getFilePDFGoodReceipt');
            let formdata = new FormData();
            formdata.append("form", nameFuntion);
            formdata.append("key", Key);
            formdata.append("data", db);
            //console.warn(formdata);
            fetch(URL, {
                method: 'POST',
                headers: {

                    "cache-control": "no-cache",
                },
                body: formdata,
            })
                .then((res) => res.json())
                .then((resData) => {
                    //console.warn('data',resData.data);
                    Linking.openURL(resData.data);
                })
                .catch((err) => {
                    console.warn('Error get file pdf!', err);
                });
        })
    }
    componentDidMount = async() => {
        var is = await this.isLogin();
        //console.warn(is)
        if (is) {
            this.props.navigation.setParams({
                _getPrint: this._getPrint
            });
            this._getData();
        } else {
            this.props.navigation.navigate('LoginStack')
        }
    }
    _getData = () => {
        //console.warn(this.state.param)
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            var db = base64.encode(JSON.stringify(this.state.param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('getGoodsReceipt');
            let formdata = new FormData();
            formdata.append("form", nameFuntion);
            formdata.append("key", Key);
            formdata.append("data", db);
            //console.warn(formdata);
            fetch(URL, {
                method: 'POST',
                headers: {

                    "cache-control": "no-cache",
                },
                body: formdata,
            })
                .then((res) => res.json())
                .then((resData) => {
                    //console.warn('data',resData);
                    this.setState({
                        idCustomer: resData.master[0].ma_kh,
                        customer: resData.master[0].ten_kh,
                        nguoiGiao: resData.master[0].ong_ba,
                        idDeal: resData.master[0].ma_dvcs,
                        dienGiai: resData.master[0].dien_giai,
                        soPhieuNhap: resData.master[0].so_ct,
                        date: resData.master[0].ngay_ct,
                        status: resData.master[0].status,
                        data: resData.detail
                    });
                })
                .catch((err) => {
                    console.warn(' Error Load!', err);
                });
        })
    }


    _renderItems = ({ item }) => (
        <TouchableOpacity onPress={() => alert(item.stt_rec0)}>
            <InputOrderItem data={item} />
        </TouchableOpacity>
    )

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.test}</Text>
                <ScrollView>
                    <View style={styles.groupContent}>
                        <View style={styles.row}>
                            <View style={[styles.formGroup]}>
                                <Text style={[commonStyles.pr25, styles.textInput]}
                                >Mã KH - Tên KH:  <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                                        {`${this.state.idCustomer} - ${this.state.customer}`}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup]}>
                                <Text style={[styles.textInput]}
                                >Người giao:  <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{this.state.nguoiGiao}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup]}>
                                <Text style={[commonStyles.pr25, styles.textInput]}
                                >Mã GD - Tên GD:  <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{`${this.state.idDeal} `}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup]}>
                                <Text style={[styles.textInput]}
                                >Diễn giải:  <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{this.state.dienGiai}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup, commonStyles.mr15]}>
                                <Text style={[styles.textInput]}
                                >Số phiếu nhập:  <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{this.state.soPhieuNhap}</Text></Text>
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={[styles.textInput]}
                                >Date:  <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{this.state.date}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup, commonStyles.mr15]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.formGroup, commonStyles.mr15]}>
                                        <Text style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                        >Tỉ giá:  <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{this.state.rate}</Text></Text>
                                    </View>
                                    {/* <View style={styles.formGroup}>
                                        <TextInput style={[commonStyles.textInputBorderBottom,styles.textInput, {textAlign:'right'}]}
                                            underlineColorAndroid="transparent"
                                            placeholder="1.00"
                                            />
                                </View> */}
                                </View>
                            </View>
                            <View style={[styles.formGroup]}>
                                <Text style={[commonStyles.textInputBorderBottom, styles.textInput]}>
                                    Trạng thái:
                                {
                                        this.state.status == 1 ? <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Nhập kho</Text> :
                                            <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Lập chứng từ</Text>
                                    }</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#f1f1f1' }}>
                        <View style={[commonStyles.flexRow, commonStyles.px15, commonStyles.py10]}>
                            <Text style={[{ fontWeight: 'bold', flex: 1 }]}>Chi tiết phiếu nhập</Text>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.data}
                        renderItem={(item) => this._renderItems(item)}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ flex: 1 }}
                        contentContainerStyle={commonStyles.p15}
                    />
                </ScrollView>
            </View>
        )
    }
}