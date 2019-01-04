import React, { Component } from 'react'
import {
    View,
    Text,
    ScrollView
} from 'react-native'
import { connect } from 'react-redux'

import {
    ApplicationStyles,
    Images,
    Colors,
    Fonts
} from '../../Themes'
import AssetsActions from '../../Redux/AssetsRedux'
import { 
    convert,
    capitalize
} from '../../Util/Helper';
import NavigationIcon from '../../Components/NavigationIcon'
import Button from '../../Components/Button'
import OrderItem from '../Order/OrderItem';
import SearchItem from './SearchItem';

class SymbolScreen extends Component {

    static navigationOptions = (props) => {
        return {
            headerLeft: (
                <NavigationIcon
                    onPress={() => props.navigation.pop()}
                    source={Images.back}
                />
            ),
            headerRight: (
                <NavigationIcon
                    onPress={() => props.navigation.navigate('Search')}
                    source={Images.search}
                />
            ),
        }
    }

    componentDidMount() {
        const { navigation, getBars } = this.props
        const value = navigation.getParam('value')
        getBars('1Min', value.symbol, 'today')
        getBars('1D', value.symbol, 'yesterday')
    }

    renderValueDetail = (value) => {
        const mainValue = `${value.qty}@${value.avg_entry_price}`
        const plStyle = value.unrealized_intraday_pl > 0 ? styles.upText : styles.downText
        const percentValue = (value.unrealized_intraday_plpc * 100).toFixed(2)

        return (
            <View style={styles.container}>
                <View style={styles.positionContain}>
                    <Text style={styles.label}>
                        Positions
                    </Text>
                    <View style={styles.rowContainer}>
                        <Text style={styles.h3}>
                            {mainValue}
                        </Text>
                        <Text style={plStyle}>
                            {convert(percentValue, true)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.label}>
                    Orders
                </Text>
                {/* <OrderItem order={value} /> */}
                <Button
                    style={styles.button}
                    label="Trade"
                    color={Colors.COLOR_NAV_HEADER}
                    labelColor={Colors.BLACK}
                    height={50}
                    onPress={() =>
                        this.props.navigation.navigate('Trade', {
                            value
                        })
                    }
                />
            </View>
        )
    }

    render() {
        const { navigation, bars, preBars } = this.props
        const value = navigation.getParam('value')

        return (
            <View style={styles.mainContainer}>
                <SearchItem
                    bars={bars}
                    preBars={preBars}
                    item={value}
                    symbolStyle={styles.symbol}
                />
                {this.renderValueDetail(value)}
            </View>
        )
    }
}

const styles = {
    ...ApplicationStyles.screen,
    container: {
        ...ApplicationStyles.screen.container,
        marginTop: 30
    },
    h2: {
        ...Fonts.style.h2,
        color: Colors.BLACK
    },
    h3: {
        ...Fonts.style.h3,
        color: Colors.BLACK
    },
    upText: {
        ...Fonts.style.h3,
        color: Colors.COLOR_GREEN,
    },
    downText: {
        ...Fonts.style.h3,
        color: Colors.COLOR_DARK_RED,
    },
    symbol: {
        ...Fonts.style.h1,
        color: Colors.BLACK
    },
    positionContain: {
        marginTop: 40,
        marginBottom: 35
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5
    },
    button: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
}

const mapStateToProps = (state) => ({
    bars: state.assets.bars,
    preBars: state.assets.preBars,
})

const mapDispatchToProps = (dispatch) => ({
    getBars: (timeframe, symbols, day) => dispatch(AssetsActions.getBarsAttempt(timeframe, symbols, day)),
    resetBars: () => dispatch(AssetsActions.resetBars()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SymbolScreen)