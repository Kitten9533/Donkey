import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

class FirstPage extends React.Component{
	render() {
		return (
			<TabNavigation navigation={this.props.navigation} />
			)
	}
}