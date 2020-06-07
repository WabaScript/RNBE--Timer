import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, Picker, Vibration } from 'react-native';

const screen = Dimensions.get('window');

const formatNumber = (number) => {
 return `0${number}`.slice(-2)
};

const getRemaining = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

// Populate picker with minutes / seconds
const createArray = length => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};
const AVAIL_MIN = createArray(60);
const AVAIL_SEC = createArray(60);

export default function App() {
  const [selectedMin, setSelectedMin] = useState("0");
  const [selectedSec, setSelectedSec] = useState("0");
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [toggle, setToggle] = useState(false);

  const { minutes, seconds } = getRemaining(remainingSeconds);

  // Render scroll pickers for time input
  const renderPickers = () => {
    return (
      <View style={styles.pickerContainer}>
        <Picker 
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedMin}
          onValueChange={itemValue => {
            setSelectedMin(itemValue);
          }}
        >
          {AVAIL_MIN.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>minutes</Text>
        <Picker 
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedSec}
          onValueChange={itemValue => {
            setSelectedSec(itemValue);
          }}
        >
          {AVAIL_SEC.map(value => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
      </View>
    )
  };

  const reset = () => {
    setRemainingSeconds(0);
    setToggle(false);
  };

  const start = () => {
    setToggle(true);
    setRemainingSeconds(parseInt(selectedMin) * 60 + parseInt(selectedSec))
  };

  useEffect(() => {
    let interval = null;
    if (toggle) {
      interval = setInterval(() => {
        setRemainingSeconds(remainingSeconds - 1)
      }, 1000);
    } else if (!toggle) {
      clearInterval(interval);
    }
    if (remainingSeconds === 0) {
      Vibration.vibrate()
      reset(), clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [toggle, remainingSeconds]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {toggle ? (
        <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
      ) : (
        renderPickers()
      )}
      {!toggle ? (
        <TouchableOpacity onPress={() => start()} style={styles.button}>
          <Text style={styles.buttonText}>Go!</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => reset()} style={[styles.button, styles.buttonStop]}>
          <Text style={[styles.buttonText, styles.buttonTextStop]}>Chill.</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#383838',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
      borderWidth: 10,
      borderColor: 'lightblue',
      width: screen.width / 2,
      height: screen.width / 2,
      borderRadius: screen.width / 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 15
  },
  buttonStop: {
    borderColor: 'red',
  },
  buttonText: {
      fontSize: 45,
      color: 'lightblue',
  },
  buttonTextStop: {
    color: 'red'
  },
  timerText: {
      color: '#fff',
      fontSize: 90,
  },
  picker: {
    width: 50
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});