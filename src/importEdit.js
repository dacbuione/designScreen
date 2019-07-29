import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, FlatList, AsyncStorage,ToastAndroid } from 'react-native';
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
import utf8 from 'utf8';
import md5 from 'md5';
import url from '../../../configs/environments/envSV';
import primaryKey from '../../../configs/environments/primaryKey'

var STORAGE_KEY = 'IP_SERVER';
const key = primaryKey;
var STORAGE_ID = 'STORAGE_ID';

export default class ImportEdit extends Component {
    constructor(props) {
        super(props);
        var uid = '';
        this.state = {
            data: [],
            modalVisible: false,
            modalCustomerVisible: false,
            modalStatusVisible: false,
            showScanner: false,
            modalDealVisible: false,
            modalRateVisible: false,
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
            ],
            pnk: 'PNH', 
            idFast:''
        };
        this.array = [];
    }
    _showBarCodeScanner = () => {
        this.setState({
            showScanner: true
        })
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                backgroundColor: Colors.mainColor,
            },
            title: 'Sua phiếu nhập',
            headerTitleStyle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
            headerLeft: <HeaderBackButton navigation={navigation} />,
            headerRight: <TouchableOpacity onPress={() => params._showBarCodeScanner()} style={commonStyles.mr15}><Image source={require('../../../assets/icons/barcode-scanner.png')} style={{ width: 22, height: 22, resizeMode: 'contain' }} /></TouchableOpacity>,
        }
    };

    componentDidMount = async() => {
        var is = await this.isLogin();
        //console.warn(is)
        if (is) {
            this.props.navigation.setParams({
                _showBarCodeScanner: this._showBarCodeScanner
            });
            this._getData();
        } else {
            this.props.navigation.navigate('LoginStack')
        }
        
    }
    isLogin= async() => {
        await AsyncStorage.getItem(STORAGE_ID).then((userId) => {
            var id = userId;
            this.uid = parseInt(id);
        })
        return this.uid;
    }
    _getData = () => {
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
                        data: resData.detail,
                        idFast: resData.master[0].stt_rec,
                    });
                })
                .catch((err) => {
                    console.warn(' Error Load! info', err);
                });
        })
    }


    _renderItems = ({ item }) => (
        <TouchableOpacity onPress={() => alert(item.tenMatHang)}>
            <InputOrderItem data={item} />
        </TouchableOpacity>
    )

    _onClose = () => {
        this.setState({
            modalVisible: false
        })
    }

    _onCustomerModalClose = () => {
        this.setState({
            modalCustomerVisible: false,
            modalDealVisible: false,
            modalRateVisible: false,
        })
    }

    _onScannerModalClose = () => {
        this.setState({
            showScanner: false
        })
    }

    _setStatus = status => {
        this.setState({
            status: status,
            modalStatusVisible: false
        })
    }
    _setItem = item => {
        this.setState({
            customer: `${item.Code} - ${item.Name}`,
            idCustomer: item.Code
        })
    }
    _setDeal = item => {
        this.setState({
            deal: `${item.ma_gd} - ${item.ten_gd}`,
            idDeal: item.ma_gd
        })
    }
    _setRate = (item) => {
        this.setState({
            rate: `${item.ma_nt} - ${item.ten_nt}`,
            idRate: item.ma_nt
        })
    }
    _onClickLuu = () => {
        // AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
        //     let token = access_token;   
        //     //console.warn('TOKEN', token)
        //     var link = URL + 'Test/saveImportOrder';
        //     if(token === undefined){
        //         var { navigate } = this.props.navigation;
        //         navigate('LoginStack');
        //     }
        //     else{
        //         fetch(link,{
        //             method: 'POST',
        //             headers: {
        //                 Accept: 'application/json',
        //                 'Content-Type': 'application/json',
        //                 Authorization: 'Bearer ' + token,
        //             },
        //             body: JSON.stringify({
        //                 maKhach: this.state.idCustomer,
        //                 nguoiGiao: this.state.nguoiGiao,
        //                 maGiaoDich: this.state.idDeal,
        //                 dienGiai: this.state.dienGiai,
        //                 soPhieuNhap: this.state.soPhieuNhap,
        //                 ngayChungTu: this.state.date,
        //                 tiGia: this.state.idRate,
        //                 trangThai: this.state.status
        //             })
        //         })
        //         .then((res) => res.json())
        //         .then((resData) => { 
        //             //console.warn('data',resData);
        //             if(resData === 1) {
        //                 alert('insert success!');
        //                 this._onRefresh();
        //                 this.props.navigation.navigate('ImportContainer')
        //             }
        //             else{
        //                 alert('save false')
        //             }
        //         })
        //         .catch((err) => {
        //             console.warn(' Error Save!',err);
        //         });
        //     }    
        // })
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            var param = [];
            this.state.data.map((item) => {
                var i = {
                    UserId: 1,
                    YourId: '',
                    FastID:this.state.idFast,
                    VcDate: this.state.date,
                    VcNo: "", // Fast sẽ cấp lại khi rỗng
                    Customer: this.state.idCustomer,
                    Buyer: this.state.nguoiGiao,
                    Note: "Test PDA",
                    Status: this.state.status == '0 - Lập chứng từ' ? '0' : '1',
                    Item: item.ma_vt, // chi tiết theo vật tư
                    Uom: utf8.encode(item.dvt),
                    Site: item.ma_kho,
                    Lot: item.ma_lo,
                    Location: item.ma_vi_tri,
                    ReasonCode: "Test",
                    Quality: item.so_luong,
                    Price: parseInt(item.gia),
                    SpecificCost: false
                }
                param.push(i);
            })
            //console.warn('pẩm', JSON.stringify(param))
            var db = base64.encode(JSON.stringify(param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('setGoodsReceipts');
            let formdata = new FormData();
            formdata.append("form", nameFuntion);
            formdata.append("key", Key);
            formdata.append("data", db);
            //console.warn(formdata);
            fetch(URL, {
                method: 'POST',
                body: formdata,
            })
                .then((res) => res.json())
                .then((resData) => {
                    //console.warn('data', resData);
                    //console.warn('data', resData[0]);
                    if (resData.loai === 1) {
                        ToastAndroid.show('Cập nhật phiếu nhập thành công!', ToastAndroid.CENTER);
                        this._onRefresh();
                        this.props.navigation.navigate('ImportContainer');
                    }
                })
                .catch((err) => {
                    console.warn(' Error edit phieu nhap!', err);
                });
        })
    }
    _onRefresh = () => {
        this.setState({
            date: null,
            status: '',
            customer: '',
            deal: '',
            rate: '',
            idCustomer: '',
            nguoiGiao: '',
            idDeal: '',
            dienGiai: '',
            soPhieuNhap: '',
            idRate: ''
        })
    }
    _setDataItem = (item) => {
        //console.warn('arr1',item)
        this.array.push(item);
        //console.warn('arr1',this.array)
        //console.warn('data0',this.state.data)
        this.setState({
            data: [item,...this.state.data]
        });
        //console.warn('data',this.state.data)
    }
    render() {
        var { data, navigation } = this.props;
        return (
            <View style={styles.container}>
                <Text>{this.state.test}</Text>
                <ScrollView>
                    <View style={styles.groupContent}>
                        <View style={styles.row}>
                            <View style={[styles.formGroup]}>
                                <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                    underlineColorAndroid="transparent"
                                    placeholder="Mã khách - Tên khách"
                                    value={this.state.customer}
                                />
                                <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.setState({ modalCustomerVisible: true })}>
                                    <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup]}>
                                <TextInput style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                    underlineColorAndroid="transparent"
                                    placeholder="Người giao"
                                    value={this.state.nguoiGiao}
                                    onChangeText={(text) => this.setState({ nguoiGiao: text })}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup]}>
                                <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                    underlineColorAndroid="transparent"
                                    placeholder="Mã giao dịch - Tên giao dịch"
                                    value={this.state.deal}
                                />
                                <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.setState({ modalDealVisible: true })}>
                                    <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup]}>
                                <TextInput style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                    underlineColorAndroid="transparent"
                                    placeholder="Diễn giải"
                                    value={this.state.dienGiai}
                                    onChangeText={(text) => this.setState({ dienGiai: text })}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup, commonStyles.mr15]}>
                                <TextInput style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                    underlineColorAndroid="transparent"
                                    placeholder="Số phiếu nhập"
                                    keyboardType='numeric'
                                    onChangeText={(text) => this.setState({ soPhieuNhap: text })}
                                    value={this.state.soPhieuNhap}
                                />
                            </View>
                            <View style={styles.formGroup}>
                                <DatePicker
                                    date={this.state.date}
                                    mode="date"
                                    placeholder="Ngày chứng từ"
                                    format="DD/MM/YYYY"
                                    confirmBtnText="Ok"
                                    cancelBtnText="Hủy"
                                    iconComponent={<Icon.Feather name="calendar" size={16} color="#999" style={{
                                        position: 'absolute', right: 0,
                                        top: 5
                                    }} />}
                                    style={[{
                                        width: '100%',
                                    }, commonStyles.textInputBorderBottom, styles.textInput]}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            paddingBottom: 10
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ date: date }) }}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.formGroup, commonStyles.mr15]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.formGroup, commonStyles.mr15]}>
                                        <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                            underlineColorAndroid="transparent"
                                            placeholder="Tỉ giá"
                                            value={this.state.rate}
                                        />
                                        <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.setState({ modalRateVisible: true })}>
                                            <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.formGroup}>
                                        <TextInput style={[commonStyles.textInputBorderBottom, styles.textInput, { textAlign: 'right' }]}
                                            underlineColorAndroid="transparent"
                                            placeholder="1.00"
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.formGroup]}>
                                <TextInput
                                    onTouchStart={() => this.setState({ modalStatusVisible: true })}
                                    placeholder="Trạng thái"
                                    style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                    underlineColorAndroid={'rgba(0,0,0,0)'}
                                    value={this.state.status} />
                                <TouchableOpacity style={styles.formGroupIcon}>
                                    <Icon.Feather name="chevron-down" size={16} color="#999" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#f1f1f1' }}>
                        <View style={[commonStyles.flexRow, commonStyles.px15, commonStyles.py10]}>
                            <Text style={[{ fontWeight: 'bold', flex: 1 }]}>Chi tiết phiếu nhập</Text>
                            <TouchableOpacity style={[commonStyles.flexRow]} onPress={() => this.setState({ modalVisible: true })}>
                                <Icon.Feather name="plus-circle" size={18} color={Colors.mainColor} />
                                <Text style={[commonStyles.mainTextColor, commonStyles.ml5]}>Thêm</Text>
                            </TouchableOpacity>
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
                <View style={commonStyles.btnRow}>
                    <SubmitButton style={[commonStyles.secondButton, commonStyles.mr10, styles.footerButton]} caption="Làm mới" textStyles={commonStyles.secondButtonText} onPress={() => this._onRefresh()} />
                    <SubmitButton style={[commonStyles.primaryButton, styles.footerButton]} caption="Lưu" textStyles={commonStyles.primaryButtonText} onPress={() => this._onClickLuu()} />
                </View>
                <NewInputOrderDetailContainer visible={this.state.modalVisible} onClose={this._onClose} _onAddItem={(item) => this._setDataItem(item)}  />
                <CustomerModalContainer visible={this.state.modalCustomerVisible} onClose={this._onCustomerModalClose} _onSaveClick={(item) => this._setItem(item)} />
                <DealModalContainer visible={this.state.modalDealVisible} onClose={this._onCustomerModalClose} _onSaveDeal={(item) => this._setDeal(item)} id={this.state.pnk} />
                <RateModalContainer visible={this.state.modalRateVisible} onClose={this._onCustomerModalClose} _onSaveRate={(item) => this._setRate(item)} />
                <BarcodeContainer visible={this.state.showScanner} onClose={this._onScannerModalClose} title="Thêm chi tiết phiếu nhập" _getData={(item) => this._setDataItem(item)} />
                <ModalPicker
                    modalVisible={this.state.modalStatusVisible}
                    data={['0 - Lập chứng từ', '1 - Nhập kho']}
                    title="Trạng thái"
                    _onClose={() => this.setState({ modalStatusVisible: false })}
                    _onSelect={(selectedVal) => this._setStatus(selectedVal)}
                />
            </View>
        )
    }
}