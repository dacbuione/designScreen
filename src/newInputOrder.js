import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, FlatList, AsyncStorage, ToastAndroid } from 'react-native';
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
import Dialog from "react-native-dialog";
import Swipeable from 'react-native-swipeable';
import utf8 from 'utf8';
import primaryKey from '../../../configs/environments/primaryKey'

var STORAGE_KEY = 'IP_SERVER';
const del = require('../../../assets/icons/delete.png');
const edit = require('../../../assets/icons/edit.png');
const key = primaryKey;
var STORAGE_ID = 'STORAGE_ID'

export default class NewInputOrder extends Component {
    constructor(props) {
        super(props);
        this.uid = '';
        var today = new Date(),
            date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        this.state = {
            data: [],
            modalVisible: false,
            modalCustomerVisible: false,
            date: date,
            status: '1 - Nhập kho',
            modalStatusVisible: false,
            showScanner: false,
            modalDealVisible: false,
            modalRateVisible: false,
            customer: '',
            deal: '2 - Nhập nội bộ',
            rate: 'VND - Đồng Việt Nam',
            idCustomer: '',
            nguoiGiao: '',
            idDeal: '2',
            dienGiai: '',
            soPhieuNhap: '',
            idRate: 'VND',
            pnk: 'PNH',
            isDelete: false,
            element: ''
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
            title: 'Thêm phiếu nhập',
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
            var URL = 'http://' + access_token + '/ApiInfo.aspx';
            var db = base64.encode(JSON.stringify(this.uid));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            let formdata = new FormData();
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
                    //console.warn('name',resData)
                    this.setState({
                        nguoiGiao: resData.name
                    })
                })
                .catch((err) => {
                    console.warn(' Error Load Info!', err);
                });
            })
    }
    deleteItem = (e) => {
        this.setState({
            isDelete: true,
            element: e
        })
    }

    _renderItems = ({ item, index }) => (
        <Swipeable style={styles.swipeable}
            onRef={(swipe) => this.swipe = swipe}
            onSwipeStart={() => this.setState({ isScroll: false })}
            onSwipeRelease={() => this.setState({ isScroll: true })}
            onRightButtonsCloseRelease={() => this.swipe = null}
            rightButtons={[
                <TouchableOpacity style={styles.button1} onPress={() => this.props.navigation.navigate('ImportEditDetailContainer',{item:item,save: this._changeItem,index: index })}>
                    <Image
                        resizeMode="contain"
                        source={edit}
                        style={{ height: 40, width: 40, margin: 20 }}
                    />
                </TouchableOpacity>,
                <TouchableOpacity style={styles.button1} onPress={() => this.deleteItem(index)}>
                    <Image
                        resizeMode="contain"
                        source={del}
                        style={{ height: 50, width: 50, margin: 20 }}
                    />
                </TouchableOpacity>
            ]}
            children={
                <TouchableOpacity >
                    <InputOrderItem data={item} />
                </TouchableOpacity>}
        >
        </Swipeable>
    )
    _chaneDelete = () => {
        this.setState({
            isDelete: false
        })
        if (parseInt(this.state.element) > -1) {
            this.state.data.splice(parseInt(this.state.element), 1);
        }
    }
    _changeItem = async(item,index) => {
        this.state.data[index] = item;
        this.update();  
    } 

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
    handleCancel = () => {
        this.setState({
            isDelete: false,
        })
        if (this.swipe) {
            this.swipe.recenter();
        }
    }
    _onClickLuu = () => {
            if (this.state.data === undefined) {
                ToastAndroid.show('Vui lòng thêm Item!', ToastAndroid.CENTER);
            } else {
                AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
                        var URL = 'http://' + access_token + '/APIQuery.aspx';
                    var param = [];
                    this.state.data.map((item) => {
                        var i = {
                            UserId: this.uid,
                            YourId: '',
                            VcDate: this.state.date,
                            VcNo: "", // Fast sẽ cấp lại khi rỗng
                            Customer: this.state.idCustomer,
                            Buyer: utf8.encode(this.state.nguoiGiao),//JSON.parse( JSON.stringify( myString ) ) test utf8
                            Note: utf8.encode(this.state.dienGiai),
                            Status: this.state.status == '0 - Lập chứng từ' ? '0' : '1',
                            Item: item.ma_vt, // chi tiết theo vật tư
                            Uom: utf8.encode(item.dvt),
                            Site: item.ma_kho,
                            Lot: item.ma_lo ? item.ma_lo : '',
                            Location: item.ma_vi_tri ? item.ma_vi_tri : '',
                            ReasonCode: "Test",
                            Quality: item.so_luong,
                            Price: parseInt(item.gia),
                            SpecificCost: false,
                            FastID: '',
                        }
                        param = [...param, i];
                    })
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
                    fetch(URL, {
                        method: 'POST',
                        body: formdata,
                    })
                        .then((res) => res.json())
                        .then((resData) => {
                            if (resData[0].loai === 1) {
                                ToastAndroid.show('Thêm phiếu nhập thành công!', ToastAndroid.CENTER);
                                this._onRefresh();
                                this.props.navigation.navigate('ImportContainer', { key: 1 });
                            } else {
                                ToastAndroid.show('Thêm phiếu nhập thất bại!', ToastAndroid.CENTER);
                            }
                        })
                        .catch((err) => {
                            console.warn(' Error set phieu nhap!', err);
                        });
                })
            }
    }
    _onRefresh = () => {
        this.setState({
            date: this.state.date,
            status: '1 - Nhập kho',
            customer: '',
            deal: '2 - Nhập nội bộ',
            rate: 'VND - Đồng Việt Nam',
            idCustomer: '',
            nguoiGiao: '',
            idDeal: '2',
            dienGiai: '',
            soPhieuNhap: '',
            idRate: 'VND',
            idCustomer: '',
            nguoiGiao: '',
        })
    }
    update = () => {
        this.setState({
            soPhieuNhap: ''
        })
    }
    _setDataItem = (item) => {
        var kt = 0
        //console.warn('dât duyệt', this.state.data)
        this.state.data.forEach(i => {
            if (i.ma_vt === item.ma_vt) {
                i.so_luong = i.so_luong + item.so_luong;
                kt = 1;
                //console.warn('1')
                return kt
            }
        })
        // this.state.data.forEach(element => {
        //     if (item.ma_vt===element.ma_vt) {
        //         element.so_luong = element.so_luong + item.so_luong;
        //         kt =1;
        //         return kt;
        //     }

        // });
        if (!kt) {
            this.setState({
                data: [...this.state.data, item]
            })
        }
        //console.warn('arr1',item)
        // this.array.push(item);
        //console.warn('arr1',this.array)
        //console.warn('data0',this.state.data)
        // this.setState({
        //     data: [item,...this.state.data]
        // });
        //console.warn('data', this.state.data);
        this.update()
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
                                    onFocus = {() => this.setState({ modalCustomerVisible: true })}
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
                                    editable = {false}
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
                            {/* <View style={[styles.formGroup, commonStyles.mr15]}>
                                <TextInput style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                    underlineColorAndroid="transparent"
                                    placeholder="Số phiếu nhập"
                                    keyboardType='numeric'
                                    onChangeText={(text) => this.setState({ soPhieuNhap: text })}
                                    value={this.state.soPhieuNhap}
                                />
                            </View> */}
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
                        {/* <View style={styles.row}>
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
                        </View> */}
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
                        renderItem={(item, index) => this._renderItems(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ flex: 1 }}
                        contentContainerStyle={commonStyles.p15}
                    />
                </ScrollView>
                <View style={commonStyles.btnRow}>
                    <SubmitButton style={[commonStyles.secondButton, commonStyles.mr10, styles.footerButton]} caption="Làm mới" textStyles={commonStyles.secondButtonText} onPress={() => this._onRefresh()} />
                    <SubmitButton style={[commonStyles.primaryButton, styles.footerButton]} caption="Lưu" textStyles={commonStyles.primaryButtonText} onPress={() => this._onClickLuu()} />
                </View>
                <NewInputOrderDetailContainer visible={this.state.modalVisible} onClose={this._onClose} _onAddItem={(item) => this._setDataItem(item)} />
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
                <Dialog.Container visible={this.state.isDelete}>
                    <Dialog.Title> You are want Delete item! </Dialog.Title>
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Ok" onPress={this._chaneDelete} />
                </Dialog.Container>
            </View>
        )
    }
}