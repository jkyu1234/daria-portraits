/**
 * Expression Manager - maps emotion scores (0-10) to Daria portrait images
 *
 * File naming convention: {score}_{variant}.png
 * e.g. 5_1.png = neutral default, 10_1.png = happy, 0_1.png = miserable, 1_1.png = angry
 */

const expressionModules = import.meta.glob('../assets/daria_expression/*.png', {
  eager: true,
  as: 'url'
})

function parseExpressions() {
  const expressionMap = {}

  Object.entries(expressionModules).forEach(([path, url]) => {
    const filename = path.split('/').pop().replace('.png', '')
    const [score] = filename.split('_')
    const scoreNum = parseInt(score)

    if (!expressionMap[scoreNum]) {
      expressionMap[scoreNum] = []
    }
    expressionMap[scoreNum].push(url)
  })

  return expressionMap
}

export function getExpressionByScore(score = 5) {
  const expressionMap = parseExpressions()
  const validScore = Math.max(0, Math.min(10, parseInt(score)))
  const expressions = expressionMap[validScore]

  if (!expressions || expressions.length === 0) {
    console.warn(`No expression image found for score ${validScore}, using default (5)`)
    return expressionMap[5]?.[0] || Object.values(expressionMap)[0]?.[0] || ''
  }

  const randomIndex = Math.floor(Math.random() * expressions.length)
  return expressions[randomIndex]
}

export function getDefaultExpression() {
  return getExpressionByScore(5)
}

export function getAvailableScores() {
  const expressionMap = parseExpressions()
  return Object.keys(expressionMap).map(score => parseInt(score)).sort((a, b) => a - b)
}
