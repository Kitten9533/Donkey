import React, {
	Component
} from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Colors from '../constants/Colors';
class SectionTitle extends React.Component {
	render() {
		return (
			<View style={styles.titleBox}>
				<Text style={styles.title}>{this.props.content}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	titleBox: {
		backgroundColor: '#efeff4',
		paddingLeft: 5,
		paddingRight: 5,
	},
	title: {
		lineHeight: 27,
		fontSize: 12,
		color: Colors.textBlack,
	},
});

export default SectionTitle;