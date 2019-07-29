import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, AsyncStorage, TouchableHighlight, Image, TextInput } from 'react-native';
// // import DrawerButton from '../../common/Buttons/DrawerButton';
// // import Colors from '../../common/Styles/Colors';
// // import { commonStyles } from '../../common/Styles/CommonStyles';
// // import HeaderButton from '../../common/Buttons/HeaderButton';
import styles from './import.style'
// import ImportItem from './importItem';
import base64 from 'react-native-base64';
// // import SubmitButton from '../../common/Buttons/SubmitButton';
import { Icon } from 'expo';
import md5 from 'md5';
import utf8 from 'utf8';
// import primaryKey from '../../../configs/environments/primaryKey';
import Swipeable from 'react-native-swipeable';
import Dialog from "react-native-dialog";
// import SeachBox from '../../common/SearchBod';
import DatePicker from 'react-native-datepicker';
// import ItemModalContainer from '../../../core/containers/modal/itemModal.container';

// const del = require('../../../assets/icons/delete.png');
// const edit = require('../../../assets/icons/edit.png');
var STORAGE_KEY = 'IP_SERVER';
// const key = primaryKey;
var STORAGE_ID = 'STORAGE_ID';

class ImportScreen extends Component {
    constructor(props) {
        super(props);
        var today = new Date(),
            date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        this.uid = '';
        this.state = {
            data: [],
            isRefreshing: false,
            isDelete: false,
            idFast:'',
            isScroll: true,
            date1: null,
            date2: date,
            count: '',
            itemCode: "",
            itemModalVisible: false
        };
        this.swipe = null;
    }

    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#fff'
        },
        headerTitleStyle: { color: '#000', fontWeight: 'bold', fontSize: 18 },
        title: 'Phiếu nhập kho thực tế',
        headerLeft: <DrawerButton navigation={navigation} />,
        headerRight: <HeaderButton iconName="plus"  navigation={navigation} onPress={() => navigation.navigate('NewInputOrderContainer')} />
    })

    _renderItems = ({ item }) => (
        <Swipeable style={styles.swipeable}
        onRef={(swipe) => this.swipe = swipe}
        onSwipeStart={() => this.setState({isScroll: false})}
        onSwipeRelease={() => this.setState({isScroll: true})}
        onRightButtonsCloseRelease = {()=> this.swipe = null}
        rightButtons={[
            <TouchableOpacity style={styles.button1} onPress={() =>this.props.navigation.navigate('ImportEditContainer',{ key: item.stt_rec })}>
                <Image
                    resizeMode="contain"
                    // source={edit}
                    source={require('../src/assets/icons/lookupIcon.png')}

                    style={{ height: 45, width: 45, margin: 20 }}
                />
            </TouchableOpacity>,
            <TouchableOpacity style={styles.button1} onPress={() => this._chaneDelete(item.stt_rec)}>
                <Image
                    resizeMode="contain"
                    source={require('../src/assets/icons/lookupIcon.png')}
                    //source{del}
                    style={{ height: 50, width: 50, margin: 20 }}
                />
            </TouchableOpacity>
        ]}
            children={
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ImportViewDetailContainer', { key: item.stt_rec })}>
                    <ImportItem data={item} />
                </TouchableOpacity>}
        >
        </Swipeable>
    )
    _getData= () => {
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            let token = access_token;   
            //console.warn('TOKEN', token)
            var link = URL + 'Test/getOrder';
            if(token === undefined){
                var { navigate } = this.props.navigation;
                navigate('LoginStack');
            }
            else{
                fetch(link,{
                    method: 'GET',
                    headers: {
                        //Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                })
                .then((res) => res.json())
                .then((resData) => { 
                    //console.warn('data',resData);
                    this.setState({
                        data:resData,
                        });
                    })
                .catch((err) => {
                    console.warn(' Error Load!',err);
                });
            }    
        })
    }
    _getData = () => {
        var today = new Date(),
            date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        this.setState({
            date1: null,
            itemCode: "",
            count: "",
            date2: date
        })
        var param = [{
            UserId: this.uid,
            Customer: '', // có thể rỗng
            VoucherCode: '', // có thể rỗng
            DateFrom: "",
            DateTo: this.state.date2,
            ItemCode: "",
            Code: '',
            SelectTop: 20
        }];
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            //console.warn('url', URL)
            var db = base64.encode(JSON.stringify(param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('getViewReceipts');
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
                    //console.warn('data',resData);
                    this.setState({
                        data: resData.Data,
                        count: resData.count,
                        isRefreshing: false
                    });
                    //console.warn('import',this.state.data)
                })
                .catch((err) => {
                    console.warn(' Error Load data!', err);
                    this.setState({
                        isRefreshing: false
                    });
                });
        })
        
    }
    isLogin= async() => {
        await AsyncStorage.getItem(STORAGE_ID).then((userId) => {
            var id = userId;
            this.uid = parseInt(id);
        })
        return this.uid;
    }
    componentDidMount = async() => {
        var is = await this.isLogin();
        //console.warn(is)
        if (is) {
            this.setState({
                isRefreshing: true
            });
            await this._getData();
        } else {
            this.props.navigation.navigate('LoginStack')
        }
        
    }
    _setFeaturedImage(id){
        if (this.swipe) {
            this.swipe.recenter();
        }
    } 
    _refresh = async () => {
        this.setState({
            isRefreshing: true
        });
        await this._getData();
        this.setState({
            isRefreshing: false,
        });
    }
    _chaneDelete = (id)=>{
        this.setState({
            isDelete: true,
            idFast: id,
        })
    }
    handleCancel = ()=>{
        this.setState({
            isDelete: false,
        })
        if (this.swipe) {
            this.swipe.recenter();
        }
    }
    handleOk = () => {
        this._setFeaturedImage(this.state.idFast);
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            var param = [{
                UserId: 1,
                FastID: this.state.idFast
            }];
            //console.warn(param);
            var db = base64.encode(JSON.stringify(param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('deleteGoodsReceipts');
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
                    //console.warn('Ma lo', resData[0].loai);
                    this.setState({
                        isDelete: false,
                    });
                     if (resData[0].loai === 1) {
                    //     alert('Delete Succes!')
                         this.componentDidMount();
                         //console.warn('click')
                     }
                })
                .catch((err) => {
                    console.warn(' Error Load Ma Lo!', err);
                });
            })
    }
    componentWillReceiveProps(nextProps) {
        //console.warn('dadadad',nextProps.navigation)
        if (nextProps.navigation.state.key != undefined) {
            this._getData();
        }
    }

    renderHeader = () => {
        return (
            <View>
            <View style={styles.row}>
                    <View style={{flex:1, padding: 5, backgroundColor:'#99FFFF'}}>
                         <Text style={{color:'red'}}>Viettronimex</Text>
                    </View>
                    <View style={{flex:1, padding: 10, backgroundColor:'#99FFFF'}}>
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
                            <Image source={require('../src/assets/icons/lookupIcon.png')} resizeMode='contain' style={{ width: 16, height: 16 }} />
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
      };
    _onSearch = (searchVal) => {
        this.setState({
            isRefreshing: true
        });
        var search = utf8.encode(searchVal);
        var param = [{
            UserId: this.uid,
            Customer: '', // có thể rỗng
            VoucherCode: '', // có thể rỗng
            DateFrom: this.state.date1,
            DateTo: this.state.date2,
            ItemCode: this.state.itemCode,
            Code: search,
            SelectTop: 20
        }];
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            //console.warn('url', URL)
            var db = base64.encode(JSON.stringify(param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('getViewReceipts');
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
                    //console.warn('data',resData);
                    this.setState({
                        data: resData.Data,
                        count: resData.count,
                        isRefreshing: false,
                    });
                    //console.warn('import',this.state.data)
                })
                .catch((err) => {
                    console.warn(' Error Load data!', err);
                    this.setState({
                        isRefreshing: false,
                    });
                });
        })
    }
    _onChaneDate1 = (date) => {
        this.setState({
            isRefreshing: true,
            date1: date
        });
        //var search = utf8.encode(searchVal);
        var param = [{
            UserId: this.uid,
            Customer: '', // có thể rỗng
            VoucherCode: '', // có thể rỗng
            DateFrom: date,
            DateTo: this.state.date2,
            ItemCode: this.state.itemCode,
            Code: '',
            SelectTop: 20
        }];
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            //console.warn('url', URL)
            var db = base64.encode(JSON.stringify(param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('getViewReceipts');
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
                    //console.warn('data',resData);
                    this.setState({
                        data: resData.Data,
                        count: resData.count,
                        isRefreshing: false,
                    });
                    //console.warn('import',this.state.data)
                })
                .catch((err) => {
                    console.warn(' Error Load data!', err);
                    this.setState({
                        isRefreshing: false,
                    });
                });
        })
    }
    _onChaneDate2 = (date) => {
        this.setState({
            isRefreshing: true,
            date2: date
        });
        //var search = utf8.encode(searchVal);
        var param = [{
            UserId: this.uid,
            Customer: '', // có thể rỗng
            VoucherCode: '', // có thể rỗng
            DateFrom: this.state.date1,
            DateTo: date,
            ItemCode: this.state.itemCode,
            Code: '',
            SelectTop: 20
        }];
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            //console.warn('url', URL)
            var db = base64.encode(JSON.stringify(param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('getViewReceipts');
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
                    //console.warn('data',resData);
                    this.setState({
                        data: resData.Data,
                        count: resData.count,
                        isRefreshing: false,
                    });
                    //console.warn('import',this.state.data)
                })
                .catch((err) => {
                    console.warn(' Error Load data!', err);
                    this.setState({
                        isRefreshing: false,
                    });
                });
        })
    }
    _onChaneItem = (item) => {
        this.setState({
            isRefreshing: true,
            itemCode: item.Code
        });
        //var search = utf8.encode(searchVal);
        var param = [{
            UserId: this.uid,
            Customer: '', // có thể rỗng
            VoucherCode: '', // có thể rỗng
            DateFrom: this.state.date1,
            DateTo: this.state.date2,
            ItemCode: item.Code,
            Code: '',
            SelectTop: 20
        }];
        AsyncStorage.getItem(STORAGE_KEY).then((access_token) => {
            var URL = 'http://' + access_token + '/APIQuery.aspx';
            //console.warn('url', URL)
            var db = base64.encode(JSON.stringify(param));
            var pk = base64.decode(key) + db;
            var md5Key = md5(pk);
            var arrKey = Array.from(md5Key);
            var Key = arrKey[1] + arrKey[8] + arrKey[29] + arrKey[17] + arrKey[22] + arrKey[15] + arrKey[11] + arrKey[16] + arrKey[21] + arrKey[0];
            var nameFuntion = base64.encode('getViewReceipts');
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
                    //console.warn('data',resData);
                    this.setState({
                        data: resData.Data,
                        count: resData.count,
                        isRefreshing: false,
                    });
                    //console.warn('import',this.state.data)
                })
                .catch((err) => {
                    console.warn(' Error Load data!', err);
                    this.setState({
                        isRefreshing: false,
                    });
                });
        })
    }
    _onCustomerModalClose = () => {
        this.setState({
            itemModalVisible: false,
        })
    }
    render() {
        //console.warn('key',this.props.navigation.getParam('key'))
        var { data, navigation } = this.props;
        return (
            <View >
                <FlatList
                    // scrollEnabled = {this.state.isScroll}
                    // data={this.state.data}
                    onRefresh={() => this._refresh()}
                    refreshing={this.state.isRefreshing}
                    // renderItem={(item) => this._renderItems(item)}
                    // keyExtractor={(item, index) => index.toString()}
                    // contentContainerStyle={styles.container}
                    // style={{ backgroundColor: '#FFF' }}
                    ListHeaderComponent={this.renderHeader}

                />
                <Dialog.Container visible = {this.state.isDelete}>
                        <Dialog.Title> You are want Delete item! </Dialog.Title>
                        <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                        <Dialog.Button label="Ok" onPress={this.handleOk} />
                    </Dialog.Container>
                    {/* <ItemModalContainer visible={this.state.itemModalVisible} onClose={this._onCustomerModalClose} _onSaveItem={(item) => this._onChaneItem(item)} /> */}
            </View>

        )
    }
}

export default ImportScreen;
