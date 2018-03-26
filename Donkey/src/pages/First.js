import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity
} from 'react-native';
// import myButton from '../common/myButton';
import Colors from '../constants/Colors';

class Main extends React.Component{
	render(){
		const { navigate } = this.props.navigation;
		return (
			<View>
				<Button 
					onPress={() => navigate('Other')}
					title="Click"
				/>
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
})

export default Main