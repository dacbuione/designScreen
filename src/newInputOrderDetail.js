import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal, AsyncStorage } from 'react-native';
import styles from './inputOrder.style'
import { commonStyles } from '../../common/Styles/CommonStyles'
import SubmitButton from '../../common/Buttons/SubmitButton';
import ModalHeader from '../modal/modalHeader';
import ModalPickerPopup from '../../common/Modal/modalPickerPopup';
import ModalPicker from '../../common/Modal/modalPicker';
import ItemModalContainer from '../../../core/containers/modal/itemModal.container';
import UomModalContainer from '../../../core/containers/modal/uomModal.container';
import MaKhoModalContainer from '../../../core/containers/modal/makhoModal.container';
import MaVTModalContainer from '../../../core/containers/modal/maVTModal.container';
import MaLoModalContainer from '../../../core/containers/modal/maLoModal.container';
import MaNXModalContainer from '../../../core/containers/modal/manxModal.container';
import VuViecModalContainer from '../../../core/containers/modal/vuviecModal.container';
import base64 from 'react-native-base64';
import md5 from 'md5';
import utf8 from 'utf8';
import primaryKey from '../../../configs/environments/primaryKey'

var STORAGE_KEY = 'IP_SERVER';
const key = primaryKey;

export default class InputOrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            itemModalVisible: false,
            uomModalVisible: false,
            maKhoModalVisible: false,
            maVTModalVisible: false,
            maLoModalVisible: false,
            manxModalVisible: false,
            vuViecModalVisible: false,
            items: '',
            idItem: '',
            uom: '',
            kho: '',
            maVT: '',
            maLo: '',
            maNX: '1111-Tiền Việt Nam',
            vuviec: '',
            uomName: '',
            maKho: '',
            maVT1: '',
            maLo1: '',
            soluong: '',
            SlSoSach: '',
            maNX1: '1111',
            maVuViec: '',
            gia: '',
            id: '',
            data1: [],
            uomBoolean: false,
            dataVT: [],
            dataLo: [],
            
        })
    }
    _onCustomerModalClose = () => {
        this.setState({
            itemModalVisible: false,
            uomModalVisible: false,
            maVTModalVisible: false,
            maLoModalVisible: false,
            maKhoModalVisible: false,
            manxModalVisible: false,
            vuViecModalVisible: false
        })
    }
    _setItem = (item) => {
        this.setState({
            items: `${item.Code} - ${item.Name}`,
            idItem: item.Code,
            uomName: item.Uom,
            uomBoolean: item.nhieu_dvt,
        })
    }
    _setUom = (item) => {
        this.setState({
            uom: `${item.Uom} - ${item.Rate}`,
            uomName: item.Uom
        })
    }
    _setKho = (item) => {
        this.setState({
            kho: `${item.Code} - ${item.Name}`,
            maKho: item.Code,
        });
    }
    _setMaVT = (item) => {
        //console.warn('item,', item)
        this.setState({
            maVT: `${item.Code} - ${item.Name}`,
            maVT1: item.Code,
            maVTModalVisible: false
        })
    }
    _setMaLo = (item) => {
        this.setState({
            maLo: `${item.Code} - ${item.Name}`,
            maLo1: item.Code
        })
    }
    _setMaNX = (item) => {
        this.setState({
            maNX: `${item.Code} - ${item.Name}`,
            maNX1: item.Code
        })
    }
    _setVuViec = (item) => {
        this.setState({
            vuviec: `${item.Code} - ${item.Name}`,
            maVuViec: item.Name
        })
    }
    _changeTT = (gia, sl) => {
        return gia * sl;
    }
    _onAddItem = (item) => {
        var dataDetail = {
            ma_vt: '', // chi tiết theo vật tư
            ma_kho: '',
            ma_vi_tri: '',
            ma_lo: '',
            dvt: '',
            ReasonCode: "Test",
            so_luong: "1",
            gia: 100,
            tien: 0,
            SpecificCost: false
        }
        dataDetail.ma_vt = this.state.idItem;
        dataDetail.dvt = this.state.uomName;
        dataDetail.ma_kho = this.state.maKho;
        dataDetail.ma_lo = this.state.maLo1;
        dataDetail.ma_vi_tri = this.state.maVT1;
        dataDetail.ReasonCode = this.state.maNX1;
        dataDetail.so_luong = this.state.soluong;
        dataDetail.gia = this.state.gia;
        dataDetail.tien = this.state.gia * this.state.soluong;
        this.props._onAddItem(dataDetail);
        this._onRefresh();
        this.props.onClose();
    }
    _onRefresh() {
        this.setState({
            items: '',
            idItem: '',
            uom: '',
            kho: '',
            maVT: '',
            maLo: '',
            maNX: '1111-Tiền Việt Nam',
            vuviec: '',
            uomName: '',
            maKho: '',
            maVT1: '',
            maLo1: '',
            soluong: '',
            SlSoSach: '',
            maNX1: '1111',
            maVuViec: '',
            gia: '',
        })
    }
    getUom = () => {
        if (this.state.uomBoolean) {
            AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
                var URL = 'http://' + access_token + '/APIQuery.aspx';
                this.setState({ uomModalVisible: true })
                var param = [{
                    UserId: 1,
                    ItemCode: this.state.idItem
                }];
                var db = base64.encode(JSON.stringify(param));
                var pk = base64.decode(key) + db;
                var md5Key = md5(pk);
                var arrKey = Array.from(md5Key);
                var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
                var nameFuntion = base64.encode('getUom');
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
                        this.setState({
                            data1: resData.Data,
                        });
                        //console.warn('uom',this.state.data)
                    })
                    .catch((err) => {
                        console.warn(' Error Load!', err);
                    });
            })
        } else {
            alert('Not change Uom!')
        }

    }
    _getMaLo = () => {
        if (this.state.idItem == '') {
            alert('Hay chon Mat hang!')
        } else {
            AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
                var URL = 'http://' + access_token + '/APIQuery.aspx';
                this.setState({ maLoModalVisible: true })
                var param = [{
                    UserId: 1,
                    ItemCode: this.state.idItem,
                    LotCode: '',
                    VoucherDate: '',
                    SelectTop: 20
                }];
                //console.warn(param);
                var db = base64.encode(JSON.stringify(param));
                var pk = base64.decode(key) + db;
                var md5Key = md5(pk);
                var arrKey = Array.from(md5Key);
                var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
                var nameFuntion = base64.encode('getLots');
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
                        this.setState({
                            dataLo: resData.Data,
                        });
                    })
                    .catch((err) => {
                        console.warn(' Error Load Ma Lo!', err);
                    });
            })
        }
    }
    _getMaVT = () => {
        if (this.state.maKho == '') {
            alert('Hay chon kho!')
        } else {
            this.setState({ maVTModalVisible: true })
            AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
                var URL = 'http://' + access_token + '/APIQuery.aspx';
                var param = [{
                    UserId: 1,
                    SiteCode: this.state.maKho,
                    LocCode: '',
                    Code: '',
                    SelectTop: 20
                }];
                //console.warn(param);
                var db = base64.encode(JSON.stringify(param));
                var pk = base64.decode(key) + db;
                var md5Key = md5(pk);
                var arrKey = Array.from(md5Key);
                var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
                var nameFuntion = base64.encode('getLocations');
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
                        this.setState({
                            dataVT: resData.Data,
                        });
                    })
                    .catch((err) => {
                        console.warn(' Error Load vTri!', err);
                    });
            })
        }
    }
    _onSearchMvt = (searchVal) => {
        var search = utf8.encode(searchVal);
            AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
                var URL = 'http://' + access_token + '/APIQuery.aspx';
                var param = [{
                    UserId: 1,
                    SiteCode: this.state.maKho,
                    LocCode: '',
                    Code: search,
                    SelectTop: 20
                }];
                //console.warn(param);
                var db = base64.encode(JSON.stringify(param));
                var pk = base64.decode(key) + db;
                var md5Key = md5(pk);
                var arrKey = Array.from(md5Key);
                var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
                var nameFuntion = base64.encode('getLocations');
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
                        this.setState({
                            dataVT: resData.Data,
                        });
                    })
                    .catch((err) => {
                        console.warn(' Error Load vTri!', err);
                    });
            })
    }
    _seachMaLo = () => {

    }
    render() {
        var { data, visible, onClose } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={() => {
                    this._onCustomerModalClose();
                }}>
                <View style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <ModalHeader title="Thêm chi tiết phiếu nhập" onClose={onClose} />
                        <ScrollView style={{ flex: 1, padding: 15 }}>
                            <View style={styles.row}>
                                <View style={[styles.formGroup, commonStyles.mr15]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Mã hàng - Tên mặt hàng"
                                        value={this.state.items}
                                    />
                                    <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.setState({ itemModalVisible: true })}>
                                        <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[{ position: 'relative', width: 100 }]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Đơn vị tính"
                                        value={this.state.uomName}
                                    />
                                    <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.getUom()}>
                                        <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={[styles.formGroup, commonStyles.mr15]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Mã kho"
                                        value={this.state.kho}
                                    />
                                    <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.setState({ maKhoModalVisible: true })}>
                                        <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.formGroup, commonStyles.mr15]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Mã vị trí"
                                        value={this.state.maVT}
                                    />
                                    <TouchableOpacity style={styles.formGroupIcon} onPress={() => this._getMaVT()}>
                                        <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.formGroup]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Mã lô"
                                        value={this.state.maLo}
                                    />
                                    <TouchableOpacity style={styles.formGroupIcon} onPress={() => this._getMaLo()}>
                                        <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={[styles.formGroup, commonStyles.mr15]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Số lượng"
                                        keyboardType='numeric'
                                        onChangeText={(text) => this.setState({ soluong: text })}
                                        value={this.state.soluong}
                                    />
                                </View>
                                <View style={[styles.formGroup, commonStyles.mr15]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Giá"
                                        keyboardType='numeric'
                                        onChangeText={(text) => this.setState({ gia: text })}
                                        value={this.state.gia}
                                    />
                                </View>
                                <View style={[styles.formGroup]}>
                                    <Text style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Thành tiền"
                                    > Thành tiền: {this.state.gia * this.state.soluong}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                {/* <View style={[styles.formGroup, commonStyles.mr15]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="SL sổ sách"
                                        onChangeText={(text) => this.setState({ SlSoSach: text })}
                                        value={this.state.SlSoSach}
                                    />
                                </View> */}
                                <View style={[styles.formGroup]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Mã nx"
                                        value={this.state.maNX}
                                    />
                                    <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.setState({ manxModalVisible: true })}>
                                        <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <View style={styles.row}>
                                <View style={[styles.formGroup]}>
                                    <TextInput style={[commonStyles.textInputBorderBottom, commonStyles.pr25, styles.textInput]}
                                        underlineColorAndroid="transparent"
                                        placeholder="Vụ việc"
                                        value={this.state.vuviec}
                                    />
                                    <TouchableOpacity style={styles.formGroupIcon} onPress={() => this.setState({ vuViecModalVisible: true })}>
                                        <Image source={require('../../../assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                            <View style={[commonStyles.flexRow, commonStyles.mt30]}>
                                <Text style={{ fontWeight: 'bold' }}>Tổng cộng:</Text>
                                <View style={styles.totalVal}>
                                    <Text style={{ textAlign: 'right' }}>{this.state.gia * this.state.soluong}</Text>
                                </View>
                                {/* <View style={styles.totalVal}>
                                    <Text style={{ textAlign: 'right' }}>0</Text>
                                </View> */}
                            </View>
                        </ScrollView>
                        <View style={commonStyles.btnRow}>
                            <SubmitButton style={[commonStyles.secondButton, commonStyles.mr10, styles.footerButton]} caption="Làm mới" textStyles={commonStyles.secondButtonText} onPress={() => this._onRefresh()} />
                            <SubmitButton style={[commonStyles.primaryButton, styles.footerButton]} caption="Lưu" textStyles={commonStyles.primaryButtonText} onPress={() => this._onAddItem()} />
                        </View>
                        <ItemModalContainer visible={this.state.itemModalVisible} onClose={this._onCustomerModalClose} _onSaveItem={(item) => this._setItem(item)} />
                        {/* <UomModalContainer visible = {this.state.uomModalVisible} onClose={this._onCustomerModalClose} _onSaveUom = {(item) => this._setUom(item)} id = {this.state.data1}/> //đỏi thanh picker combobox  */}
                        <MaKhoModalContainer visible={this.state.maKhoModalVisible} onClose={this._onCustomerModalClose} _onSaveKho={(item) => this._setKho(item)} />
                        {/* <MaVTModalContainer visible = {this.state.maVTModalVisible} onClose={this._onCustomerModalClose} _onSaveMaVT = {(item) => this._setMaVT(item)} />   */}
                        {/* <MaLoModalContainer visible = {this.state.maLoModalVisible} onClose={this._onCustomerModalClose} _onSaveMaLo = {(item) => this._setMaLo(item)} />   */}
                        <MaNXModalContainer visible={this.state.manxModalVisible} onClose={this._onCustomerModalClose} _onSaveMaNX={(item) => this._setMaNX(item)} />
                        <VuViecModalContainer visible={this.state.vuViecModalVisible} onClose={this._onCustomerModalClose} _onSaveVuViec={(item) => this._setVuViec(item)} />
                    </View>
                </View>
                <ModalPicker

                    modalVisible={this.state.uomModalVisible}
                    data={this.state.data1}
                    title="Đơn vị tính"
                    _onClose={() => this.setState({ uomModalVisible: false })}
                    _onSelect={(selectedVal) => this._setUom(selectedVal)}
                />
                <ModalPickerPopup 
                    modalVisible={this.state.maVTModalVisible}
                    data={this.state.dataVT}
                    title="Mã vị trí"
                    onSearch={this._onSearchMvt}
                    _onClose={() => this.setState({ maVTModalVisible: false })}
                    _onSelect={(selectedVal) => this._setMaVT(selectedVal)}
                />
                <ModalPickerPopup
                    modalVisible={this.state.maLoModalVisible}
                    data={this.state.dataLo}
                    title="Mã lô"
                    onSearch={this._seachMaLo}
                    _onClose={() => this.setState({ maLoModalVisible: false })}
                    _onSelect={(selectedVal) => this._setMaLo(selectedVal)}
                />
            </Modal>


        )
    }
}