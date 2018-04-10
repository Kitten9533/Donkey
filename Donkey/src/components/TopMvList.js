import React, {
	Component,
} from 'react'
import {
	StyleSheet,
	ActivityIndicator,
	View,
	Text,
	Button,
	Image,
	Dimensions,
	ListView,
	RefreshControl,
	TouchableOpacity,
} from 'react-native'
import {
	getTopMv
} from '../services/getResources';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

class TopMvList extends React.Component {

	constructor(props) {
		super(props);
		this.getList = this.getList.bind(this);
		this._renderListView = this._renderListView.bind(this);
		this._endReached = this._endReached.bind(this);
		this._getLoading = this._getLoading.bind(this);
		this._toPlayer = this._toPlayer.bind(this);
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			...this.props,
			...{
				index: 1,
				limit: 10,
				allData: [],
				firstLoad: false,
				isLoading: true,
				hasMore: false,
				activeOpacity: 0.95,
			},
			...{
				ds: ds
			},
			...{
				dataSource: ds.cloneWithRows([{}])
			},
		};
	}

	componentWillMount() {
		this.getList();
	}

	_toPlayer(id, name) {
		this.props.navigation.navigate('MvPlayer', {
			mvId: id,
			mvName: name,
		});
	}

	_renderListView(rowData) {
		return (
			<View style={this.state.firstLoad ? styles.card : ''}>
				<TouchableOpacity
					activeOpacity={this.state.activeOpacity}
					onPress={() => {this._toPlayer(rowData.id, rowData.name)}}
					>
					<Image 
						source={{uri: rowData.cover}} 
						style={styles.contentImage}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={this.state.activeOpacity}
					onPress={() => {this._toPlayer(rowData.id, rowData.name)}}
					>
					<View style={styles.contentBox}>
						<Text  
							style={styles.contentName}
							numberOfLines={2}>{rowData.name}
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	async getList() {
		let index = this.state.index,
			limit = this.state.limit,
			allData = this.state.allData;
		let offset = (index - 1) * limit;
		let res = await getTopMv(offset, limit);
		if (res.hasMore) {
			allData = [...allData, ...res.data];
			index++;
			this.setState({
				index: index,
				allData: allData,
				firstLoad: true,
				isLoading: false,
				hasMore: true,
				dataSource: this.state.ds.cloneWithRows(allData)
			});
		} else {
			this.setState({
				hasMore: false,
				isLoading: false,
			});
		}
	}

	_endReached() {
		if (!this.state.firstLoad) {
			return;
		}
		this.setState({
			isLoading: false,
		});
		this.getList();
	}

	_getLoading() {
		let loading = null;
		if (this.state.isLoading) {
			loading = (
				<View style={styles.centerBox}>
				<ActivityIndicator
			      	style={styles.centering}
			        color={Colors.grass}
			        animating={this.state.isLoading}
			        size="small"
			        />
				</View>
			);
		}
		return loading;
	}

	_renderFooter() {
		let footer = null;
		if (this.state.firstLoad) {
			footer = (
				<View style={[styles.card, ...styles.footer]}>
					<Image
					   	source={require('../assets/loading3.gif')}
					    style={styles.footerImg}
				    />
				</View>
			);
		}
		return footer;
	}

	render() {
		let loading = this._getLoading();
		return (
			<View style={styles.container}>
				<Text style={styles.refresh}></Text>
				{loading}
				<ListView style={{flex: 1}}
					dataSource={this.state.dataSource}
					renderRow={this._renderListView}
			        contentContainerStyle={styles.listView}
			        initialListSize={5}
			        onEndReached={() => this._endReached()}
	       			onEndReachedThreshold={50}
	       			renderFooter={() => this._renderFooter()}
					>
				</ListView>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	refresh: {},
	container: {
		flex: 1,
		position: 'relative',
	},
	footer: {
		marginTop: 20,
		marginBottom: 15,
		alignItems: 'center',
	},
	footerImg: {
		height: 80,
	},
	centerBox: {
		// flex: 1,
		height: 40,
		// borderWidth: 1,
		// borderColor: 'black',
		position: 'relative',
		alignItems: 'center',
		// justifyContent: 'center',
		zIndex: 100,
		marginTop: 5,
		marginBottom: 10,
	},
	centering: {
		backgroundColor: Colors.navigation,
		marginTop: 10,
		borderRadius: 20,
		width: 28,
		height: 28,
	},
	card: {
		borderRadius: 5,
		borderWidth: 1,
		borderColor: Colors.navigation,
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10,
		shadowColor: 'green',
		shadowOffset: {
			h: 10,
			w: 10
		},
		shadowRadius: 3,
		shadowOpacity: 0.8,
		backgroundColor: Colors.navigation,
		// position: 'relative',
		// height: 240,
	},
	contentImage: {
		// width: Layout.window.width,
		height: 200,
		marginTop: 5,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 5,
		// position: 'absolute',
		// top: 0,
		// left: 0,
	},
	contentBox: {
		height: 40,
	},
	contentName: {
		lineHeight: 20,
		fontSize: 12,
		marginRight: 100,
		start: 5,
		// position: 'absolute',
		// top: 200,
		// left: 0,
	},
})

export default TopMvList