import React, { PureComponent } from 'react';
import { ColorPropType, requireNativeComponent, View, ViewPropTypes as RNViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const ViewPropTypes = RNViewPropTypes || View.propTypes;
let firstTimeOnChange = true

const stateFromProps = (props) => {
  let selectedIndex = 0;

  const items = props.children.map(({ props: { value, label } }, index) => {
    if (value === props.selectedValue) {
      selectedIndex = index;
    }

    return { value, label };
  });

  return { selectedIndex, items };
};

class WheelCurvedPicker extends PureComponent {
  static propTypes = {
    ...ViewPropTypes,
    data: PropTypes.array,
    textColor: ColorPropType,
    currentTextColor: ColorPropType,
    textSize: PropTypes.number,
    itemSpace: PropTypes.number,

    // new props
    indicatorStyle: PropTypes.object,
    indicatorSize: PropTypes.number,
    indicatorColor: ColorPropType,
    indicator: PropTypes.bool,
    curtain: PropTypes.bool,
    curtainColor: ColorPropType,
    atmospheric: PropTypes.bool,
    curved: PropTypes.bool,
    visibleItemCount: PropTypes.number,

    onValueChange: PropTypes.func.isRequired,
    selectedValue: PropTypes.any,
    selectedIndex: PropTypes.number,
  };

  static defaultProps = {
    textSize: 26,
    itemSpace: 20,
    textColor: '#9f9f9f',
    currentTextColor: '#333'
  };

  state = {}

  onValueChange = ({ nativeEvent: { data } }) => {
    if(firstTimeOnChange) {
      return firstTimeOnChange = false
    }
    this.props.onValueChange(data); 
  }

  componentDidMount() {
    this.setState(stateFromProps(this.props));
  }

  static getDerivedStateFromProps(nextProps) {
    return stateFromProps(nextProps)
  }

  render() {
    const { children, ...otherProps } = this.props;

    return (
      <WheelCurvedPickerNative
        {...otherProps}
        onValueChange={this.onValueChange}
        data={this.state.items}
        selectedIndex={parseInt(this.state.selectedIndex, 10)}
      />
    );
  }
}

class Item extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  };

  // These items don't get rendered directly.
  render = () => null;
}

WheelCurvedPicker.Item = Item;

const WheelCurvedPickerNative = requireNativeComponent('WheelCurvedPicker', WheelCurvedPicker);

export default WheelCurvedPicker;
