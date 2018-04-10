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
	ScrollView,
} from 'react-native';

import Video from 'react-native-video';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

import {
	getMvDetail
} from '../services/getResources';
import SimiMv from '../components/SimiMv';
import Comments from '../components/Comments';

class MvPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			...this.props,
			...{
				cover: null,
				mvUrl: null,
				loadend: false,
				videoWidth: Layout.window.width,
				videoHeight: 200,
				isPlaying: false,
				playingRate: 1.0,
				firstLoad: true,
				name: '',
				artistName: '',
				artistId: '',
				briefDesc: '',
				desc: '',
				data: {},
			},
		};
		this.getMvDetail = this.getMvDetail.bind(this);
		this.getMvBox = this.getMvBox.bind(this);
		this._setPlaying = this._setPlaying.bind(this);
		this.onEnd = this.onEnd.bind(this);
		this.getShade = this.getShade.bind(this);
		this.videoPause = this.videoPause.bind(this);
	}

	static navigationOptions = ({
		navigation
	}) => ({
		title: navigation.state.params.mvName,
		// header: null,
		// headerStyle: {
		// 	backgroundColor: 'rgba(0, 0, 0, 0)',
		// 	height: 50,
		// },
		// headerTitleStyle: { //标题字体
		// 	color: Colors.textBlack,
		// },
	})

	_onLayout(evnet) {
		let {
			width,
			height
		} = event.nativeEvent.layout;
		this.setState({
			videoWidth: width,
			// videoHeight: height,
		})
	}

	async getMvDetail() {
		const {
			params
		} = this.props.navigation.state;
		if (!params.mvId) {
			alert('Error in getting mvId');
			return;
		}
		let res = await getMvDetail(params.mvId);
		let mvUrl = null,
			cover = res.data.cover;
		//mv视频地址
		let brs = res.data.brs;
		let briefDesc = res.data.briefDesc;
		let desc = res.data.desc;
		let name = res.data.name;
		let artistName = res.data.artistName;
		let artistId = res.data.artistId;
		let data = res.data;
		mvUrl = brs['720'] || brs['480'] || brs['240'] || brs['1080'] || '';
		if (!mvUrl) {
			alert('Error in getting mv urls');
		}
		this.setState({
			loadend: true,
			mvUrl: mvUrl,
			cover: cover,
			briefDesc: briefDesc,
			desc: desc,
			name: name, //mv名
			artistName: artistName, //作者
			artistId: artistId, //作者id
			data: data,
		});
	}

	componentDidMount() {
		const {
			params
		} = this.props.navigation.state;
		//在static中使用this方法  
		this.props.navigation.setParams({
			mvName: params.mvName,
			mvId: params.mvId,
		});
	}

	componentWillMount() {
		this.getMvDetail();
	}

	_setPlaying() {
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
	}

	onEnd() {
		let isPlaying = this.state.isPlaying;
		this.setState({
			isPlaying: false,
		})
	}

	videoPause() {
		//子页面点击事件触发，使页面跳转时使视频暂停
		this.setState({
			isPlaying: false,
		});
	}

	getMvBox() {
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};
		return (
			<Video source={{uri: this.state.mvUrl}}   // Can be a URL or a local file. 
		       	ref={(ref) => {
		        	this.player = ref
		       	}}                                      // Store reference 
		       	rate={this.state.playingRate}                              // 0 is paused, 1 is normal. 
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
				onBuffer={this.onBuffer}                // Callback when remote video is buffering 
				onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
		       	// style={styles.video} 
		       	style={{width: this.state.videoWidth, height: this.state.videoHeight}}
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
						<Image
						style = {styles.videoIcon}
						source = {require('../assets/play.png')	} />
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
						<Image
						style = {styles.videoIcon}
						source = {require('../assets/play.png')	} />
					</View>
				</View>
			);
		} else {
			return null;
		}
	}

	render() {
		const {
			params
		} = this.props.navigation.state;
		let myMvBox = this.getMvBox();
		// let myShade = null;
		let myShade = this.getShade();
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};
		return (
			<ScrollView style={styles.container}>
				<StatusBar hidden={true} />
				<TouchableHighlight style={[styles.videoBox, defaultSize]} onPress={() => {this._setPlaying()}} underlayColor='#fff'>
					<View>
						{myMvBox}
					</View>
				</TouchableHighlight>
				<TouchableOpacity style={[styles.videoModal ,defaultSize]} onPress={() => {this._setPlaying()}}>
					{myShade}
				</TouchableOpacity>
				<MvInfo {...this.state}/>
				<SimiMv mvId={this.props.navigation.state.params.mvId} navigation={this.props.navigation} videoPause={this.videoPause}/>
				<Comments mvId={this.props.navigation.state.params.mvId} navigation={this.props.navigation} videoPause={this.videoPause}/>
			</ScrollView>
		);
	}
}

class TextContent extends React.Component {
	render() {
		return (
			<Text  
				style={styles.contentName}
				numberOfLines={this.props.linesNum}>
				{this.props.contentVal}
			</Text>
		);
	}
}

class MvInfo extends React.Component {
	render() {
		return (
			<View style={[styles.mvDetail]}>
				<TextContent linesNum={1} contentVal={this.props.name} />
				<Text style={[styles.mvDetailText ,styles.textLeft]} >
					{`发布：${this.props.data.publishTime}     |     播放：${this.props.data.playCount}`}
				</Text>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
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
		backgroundColor: 'rgba(0,0,0,0.45)',
	},
	shade: { //暂停播放图标
		position: 'absolute',
		top: 0,
		left: 0,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 102,
		backgroundColor: 'rgba(0,0,0,0.45)',
	},
	shade2: { //背景图片
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 101,
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
});

export default MvPlayer;