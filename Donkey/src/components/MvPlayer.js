import React, {
	Component
} from 'react';

import {
	StyleSheet,
	View,
	Text,
	Image,
} from 'react-native';

import Video from 'react-native-video';

import {
	getMvDetail
} from '../services/getResources';

class MvBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = this.props;
	}
	componentDidMount() {
		// Later to trigger fullscreen 
		this.player.presentFullscreenPlayer()

		// To set video position in seconds (seek) 
		this.player.seek(0)
	}
	render() {
		console.log('mvUrl', this.state.mvUrl);
		return (
			<Video source={{uri: this.state.mvUrl}}   // Can be a URL or a local file. 
		       	ref={(ref) => {
		        	this.player = ref
		       	}}                                      // Store reference 
		       	rate={1.0}                              // 0 is paused, 1 is normal. 
		       	volume={1.0}                            // 0 is muted, 1 is normal. 
		       	muted={false}                           // Mutes the audio entirely. 
		       	paused={false}                          // Pauses playback entirely. 
		       	resizeMode="cover"                      // Fill the whole screen at aspect ratio.* 
		       	repeat={true}                           // Repeat forever. 
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
		       	style={styles.backgroundVideo} 
		    />
		);
	}
}

class MvPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.getMvDetail = this.getMvDetail.bind(this);
		this.getMvBox = this.getMvBox.bind(this);
		this.state = {
			...this.props,
			...{
				cover: null,
				mvUrl: null,
				loadend: false
			},
		};
	}

	static navigationOptions = ({
		navigation
	}) => ({
		title: navigation.state.params.mvName
	})

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
		mvUrl = brs['720'] || brs['240'] || brs['480'] || brs['1080'] || '';
		if (!mvUrl) {
			alert('Error in getting mv urls');
		}
		this.setState({
			loadend: true,
			mvUrl: mvUrl,
			cover: cover,
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
		this.getMvDetail();
	}

	getMvBox() {
		if (this.state.loadend && !!this.state.mvUrl) {
			// return (<Text>{this.state.mvUrl}</Text>)
			return (<MvBox mvUrl={this.state.mvUrl}/>);
		} else if (this.state.cover) {
			return (<Image 
					src = {{uri: this.state.cover}} />);
		} else {
			return (<Image
					source={require('../assets/loading2.gif')}
				    style={styles.footerImg}
				/>);
		}
	}

	render() {
		const {
			params
		} = this.props.navigation.state;
		let myMvBox = this.getMvBox();
		return (
			<View style={styles.container}>
				{myMvBox}
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundVideo: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	footerImg: {
		height: 80,
	},
});

export default MvPlayer;