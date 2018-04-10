import React, {
	Component
} from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Button
} from 'react-native';
import {
	withNavigation
} from 'react-navigation';
class MyButton extends React.Component {
	render() {
		return (
			<Button 
				onPress = {() => {}}
				title = "withNavigation" 
			/>
		)
	}
}

export default withNavigation(MyButton);