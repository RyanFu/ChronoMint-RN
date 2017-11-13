import themeFactory from 'src/utils/themeFactory'
import { UNIT, BACKGROUND, FOREGROUND } from 'src/constants/styles'

const common = {
  listStyle: {},
  itemContainer: {
    height: 6 * UNIT,
    flexDirection: 'row',
    alignItems: 'center'
  },
  spacer: {
    flex: 1
  },
  itemIcon: {
    marginHorizontal: UNIT
  },
  itemChevronContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
}

const dark = {
  text: {
    color: BACKGROUND
  }
}

const light = {
  list: {
    backgroundColor: BACKGROUND,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CCCCDF'
  },
  text: {
    color: FOREGROUND
  }
}

export default themeFactory(common, { dark, light })
