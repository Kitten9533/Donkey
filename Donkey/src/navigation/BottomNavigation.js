import React, {
	Component
} from 'react'
import {
	StyleSheet,
	View,
	Text,
	Button
} from 'react-native'
import { StackNavigator, TabNavigator} from 'react-navigation';
import Main from '../pages/Main';
import Sub from '../pages/Sub';

const BottomNavigation = TabNavigator({
	Main: {
		screen: Main,
		navigationOptions: {
			header: null,
		},
	},
	Sub: {
		screen: Sub,
		navigationOptions: {
			header: null,
		},
	},
},{
	initialRouteName: 'Main',
	tabBarPosition: 'top',
	tabBarOptions: {
		// showIcon: true,
		// showLabel: false,
		// style: {
		// 	// backgroundColor: '#d33a31', 
		// 	paddingLeft: 80,
		// 	paddingRight: 80,
		// },
		// tabStyle: {
		// 	// borderColor: '#fff',
		// 	// borderWidth: 1,
		// 	width: 60,
		// 	flex: 1,
		// 	alignSelf: 'center',
		// },
		// indicatorStyle: {
		// 	height: 0,
		// },
	},
})

const styles = StyleSheet.create({
	container: {
		
	},
	icon: {
		marginTop: 15,
		marginBottom: 15,
		fontFamily: 'iconfont', 
		fontSize: 20, 
		width: 20,
		height: 20,
		color: '#fff',
	},
	menu: {
		// flex: 1,
	}
})

export default BottomNavigation