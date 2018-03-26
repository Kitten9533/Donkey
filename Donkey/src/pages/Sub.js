import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

class Sub extends React.Component{
	static navigationOptions = {
   	    headerTitle: 'Sub',
   	    drawerLabel: 'Sub',
	};
	render(){
		return (
			<View>
				<Text>Sub</Text>
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
})

export default Sub