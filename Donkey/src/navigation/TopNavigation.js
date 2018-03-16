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
import MainOne from '../pages/MainOne';
import MainTwo from '../pages/MainTwo';
import MainThree from '../pages/MainThree';
import icon from '../common/iconfontConf';
import dicConf from '../common/dicConf';

const TopNavigation = TabNavigator({
	MainOne: {
		screen: MainOne,
		navigationOptions: {
			header: null,
			// tabBarLabel: null,  
			tabBarIcon: (focused, tintColor) => ( 
				<Text style={styles.icon}>
	                {icon('yinle')}
	            </Text>
	        ),
	        // tabBarLabel: (focused, tintColor) => {
	        // 	<Text style={styles.menu}>
	        // 		目录
	        // 	</Text>
	        // }
		},
	},
	MainTwo: {
		screen: MainTwo,
		navigationOptions: {
			header: null,
			// title: null,
			tabBarIcon: (focused, tintColor) => ( 
				<Text style={styles.icon}>
	                {icon('icon-test')}
	            </Text>
	        ),
		},
	},
	MainThree: {
		screen: MainThree,
		navigationOptions: {
			header: null,
			tabBarIcon: (focused, tintColor) => ( 
				<Text style={styles.icon}>
	               	{icon('pengyou')}
	            </Text>
	        ),
		},
	},
},{
	initialRouteName: 'MainOne',
	tabBarPosition: 'top',
	tabBarOptions: {
		showIcon: true,
		showLabel: false,
		style: {
			backgroundColor: '#d33a31', 
			paddingLeft: 80,
			paddingRight: 80,
		},
		tabStyle: {
			// borderColor: '#fff',
			// borderWidth: 1,
			width: 60,
			flex: 1,
			alignSelf: 'center',
		},
		indicatorStyle: {
			height: 0,
		},
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

export default TopNavigation