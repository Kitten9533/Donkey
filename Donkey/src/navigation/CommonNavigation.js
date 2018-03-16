import React, {
	Component
} from 'react'
import {
	StyleSheet,
	View,
	Text,
	Button
} from 'react-native'
import { StackNavigator, TabNavigator} from 'react-navigation'
import Other from '../pages/Other'
import BottomNavigation from '../navigation/BottomNavigation';

const CommonNavigation = StackNavigator ({
	Other: {
		screen: Other,
		navigationOptions: {
	   	    headerTitle: 'Other',
	    },
	},
	BottomNavigation: {
		screen: BottomNavigation,
		navigationOptions: {
	      headerTitle: null,
	    },
	}
},{
	initialRouteName: 'BottomNavigation',
	navigationOptions: {
		headerTintColor: '#fff',
		headerStyle: {
			backgroundColor: '#d33a31',
			height: 50,
		},
		cardStyle: {
			backgroundColor: '#fff',
			color: 'red', 
		}
	},
})

export default CommonNavigation