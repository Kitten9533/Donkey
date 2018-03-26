import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity
} from 'react-native';
// import myButton from '../common/myButton';
import Colors from '../constants/Colors';

class LeftUserInfo extends React.Component{
  	//drawer开头的为抽屉导航的参数 
  	static navigationOptions = {
   	    headerTitle: '个人信息',
   	    drawerLabel: '个人信息',
		// drawerIcon: ({ tintColor }) => (
	 //      <Image
	 //        source={require('../assets/notif-icon.png')}
	 //        style={[styles.icon, {tintColor: tintColor}]}
	 //      />
	 //    ),
	};
	render(){
		const { navigate } = this.props.navigation;
		return (
			<View>
				<Text>LeftUserInfo</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	toolbar: {
    	backgroundColor: '#e9eaed',
    	height: 56,
  	},
  	button: {
  		height: 40,
  		alignItems: 'center',
  		justifyContent: 'center',
  		backgroundColor: Colors.navigation,
  	},
  	text: {
  		color: Colors.textBlack,
  	},
  	icon: {
  		width: 24,
  		height: 24,
  	}
})

export default LeftUserInfo