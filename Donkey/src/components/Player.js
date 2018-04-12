import React, {
	Component
} from 'react';

import {
	StyleSheet,
	View,
	Text,
	Image,
	StatusBar,
	Dimensions,
	TouchableOpacity,
	TouchableHighlight,
} from 'react-native';

import Video from 'react-native-video';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

class Player extends React.Component {
	constructor(props) {
		super(props);
		let {
			mvUrl,
			cover,
			showLoading,
		} = this.props;
		this.state = {
			mvUrl: mvUrl,
			cover: cover,
			isPlaying: false,
			videoWidth: Layout.window.width,
			videoHeight: Layout.window.width * 9 / 16,
			firstLoad: true,
			showLoading: showLoading,
		};
		this._onLayout = this._onLayout.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		let oldMvUrl = this.props.mvUrl;
		let newMvUrl = nextProps.mvUrl;
		if (oldMvUrl == newMvUrl) {
			this.setState({
				// isPlaying: nextProps.isPlaying,
				showLoading: nextProps.showLoading,
			});
			return;
		}
		this.setState({
			mvUrl: nextProps.mvUrl,
			cover: nextProps.cover,
			// isPlaying: nextProps.isPlaying,
			showLoading: nextProps.showLoading,
			firstLoad: true,
		});
	}

	_onLayout(evnet) {
		return;
		// let {
		// 	width,
		// 	height
		// } = event.nativeEvent.layout;
		// height = 9 * width / 16;
		// this.setState({
		// 	videoWidth: width,
		// 	videoHeight: height,
		// })
	}

	async _setPlaying() {
		let {
			firstLoad,
			isPlaying,
			playingRate
		} = this.state;
		if (firstLoad) { //在播放中判断是否暂停
			this.setState({
				firstLoad: false,
				isPlaying: true,
			});
		} else {
			this.setState({
				firstLoad: false,
				isPlaying: !isPlaying
			})
		}
		// let newPlayingState = this.state.isPlaying
		// this.props.setPlayingState(newPlayingState);
	}

	_changePlayingState() {
		alert(1);
	}

	_renderMvBox() {
		let {
			showLoading
		} = this.state;
		if (showLoading) {
			return (
				<View style={[styles.imageBox, {height: this.state.videoHeight}]}>
					<Image style={styles.img} source={require('../assets/loading.gif')} />
				</View>
			);
		}

		return (
			<Video 
				source={{uri: this.state.mvUrl}}   // Can be a URL or a local file. 
			   	ref={(ref) => {
		        	this.player = ref
			    }}                                      // Store reference 
			   	rate={1}                              // 0 is paused, 1 is normal. 
		       	volume={1.0}                            // 0 is muted, 1 is normal. 
		       	muted={false}                           // Mutes the audio entirely. 
		       	paused={!this.state.isPlaying}                          // Pauses playback entirely. 
		       	resizeMode="cover"                      // Fill the whole screen at aspect ratio.* 
		       	repeat={false}                           // Repeat forever. 
		       	playInBackground={false}                // Audio continues to play when app entering background. 
		       	playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown. 
		       	ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual. 
		       	progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms) 
				onLoadStart={this.loadStart}            // Callback when video starts to load 
				onLoad={this.setDuration}               // Callback when video loads 
				onProgress={this.setTime}               // Callback every ~250ms with currentTime 
				onEnd={this.onEnd}                      // Callback when playback finishes 
				onError={this.videoError}               // Callback when video cannot be loaded 
		onBuffer = {
			this.onBuffer
		} // Callback when remote video is buffering
				onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
		       	// style={styles.video} 
		       	style={[{width: this.state.videoWidth, height: this.state.videoHeight}]}
			/>
		);
	}

	getShade() {
		let {
			firstLoad,
			isPlaying
		} = this.state;
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};
		let coverImg = null;
		if (firstLoad) {
			coverImg = (
				<Image 
					source = {{uri: this.state.cover}} 
					style={[defaultSize]}
				/>
			);
			return (
				<View style={[styles.shadeBox, defaultSize]}>
					<View style={[styles.shade, defaultSize]}>
						<TouchableOpacity style={styles.centerBtn} onPress={()=>{this._changePlayingState()}}>
							<Image
							style={styles.videoIcon}
							source={require('../assets/play.png')}/>
						</TouchableOpacity>
					</View>
					<View style={[styles.shade2, defaultSize]}>
						{coverImg}
					</View>
				</View>
			);
		} else if (!firstLoad && !isPlaying) {
			return (
				<View style={[styles.shadeBox, defaultSize]}>
					<View style={[styles.shade, defaultSize]}>
						<TouchableOpacity style={styles.centerBtn} onPress={()=>{this._changePlayingState()}}>
							<Image
							style = {styles.videoIcon}
							source = {require('../assets/play.png')}/>
						</TouchableOpacity>
					</View>
				</View>
			);
		} else {
			return null;
		}
	}

	render() {
		let myMvBox = this._renderMvBox();
		let myShade = this.getShade();
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};
		return (
			<View style={styles.container}>
				<StatusBar hidden={true} />
				<TouchableHighlight style={[styles.videoBox, defaultSize]} onPress={( ) => {this._setPlaying()}} underlayColor='#fff'>
					<View>
						{myMvBox}
					</View>
				</TouchableHighlight>
				<TouchableOpacity style={[styles.videoModal, defaultSize]} onPress={() => {this._setPlaying()}}>
					{myShade}
				</TouchableOpacity>
			</View>
		);

	}
}

var styles = StyleSheet.create({
	container: {
		// flex: 1,
		position: 'relative',
	},
	imageBox: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	img: {
		width: 50,
		height: 6,
	},
	videoBox: {
		position: 'relative',
		backgroundColor: '#000000',
	},
	videoModal: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	shadeBox: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 100,
		backgroundColor: 'rgba(0,0,0,0.35)',
	},
	shade: { //暂停播放图标
		position: 'absolute',
		top: 0,
		left: 0,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 102,
		backgroundColor: 'rgba(0,0,0,0.35)',
	},
	shade2: { //背景图片
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 101,
	},
	centerBtn: {
		width: 70,
		height: 44,
		backgroundColor: 'rgba(0,0,0,0.50)',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
	},
	videoIcon: {
		width: 36,
		height: 36,
	},
	contentName: {
		lineHeight: 18,
		fontSize: 12,
		color: Colors.textBlack,
	},
	mvDetail: {
		paddingTop: 12,
		paddingLeft: 8,
		paddingRight: 8,
		paddingBottom: 12,
		backgroundColor: Colors.rowColor,
	},
	mvDetailText: {
		marginTop: 3,
		lineHeight: 15,
		fontSize: 12,
		color: '#808080',
	},
	textLeft: {
		marginRight: 50,
	},
	textRight: {
		marginLeft: 50,
	},
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
	row: {
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 10,
		backgroundColor: '#F6F6F6',
		borderColor: Colors.backgroundColor,
		borderBottomWidth: 1,
	},
	thumb: {
		marginTop: 0,
		width: 30,
		height: 30,
		borderRadius: 30,
	},
	textBox: {
		flex: 1,
		paddingTop: 0,
		paddingLeft: 0,
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},
	text: {
		fontSize: 10,
		padding: 2,
		start: 6,
		color: Colors.textBlack,
	},
	textContent: {
		fontSize: 12,
		start: 6,
		color: Colors.textBlack,
	},
	noList: {
		height: 100,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.rowColor,
	},
	noListText: {
		color: '#808080',
		fontSize: 12,
	}
});

export default Player;