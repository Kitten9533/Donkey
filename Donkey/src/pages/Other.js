import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
class Other extends React.Component{
	static navigationOptions = {
	   	headerTitle: 'Other',
	};
	render(){
		return (
			<View>
				<Text>Other</Text>
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

export default Other