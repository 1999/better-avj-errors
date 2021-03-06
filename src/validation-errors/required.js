import chalk from 'chalk';
import printJson from '../json/print';
import findErrorPosition from '../json/find-error-position';
import BaseValidationError from './base';

export default class RequiredValidationError extends BaseValidationError {
  print(schema, data) {
    const output = [];
    const { message, dataPath, params } = this.options;
    output.push(chalk`{red {bold REQUIRED} ${message}}\n`);

    return output.concat(
      printJson(data, dataPath, { indent: this.indent })(() => {
        return chalk`☹️  {bold ${params.missingProperty}} is missing here!`;
      })
    );
  }

  getError(schema, data) {
    const { message, dataPath, params } = this.options;
    const jsonString = JSON.stringify(data, null, this.indent);
    const { line, column } = findErrorPosition(jsonString, dataPath);

    return {
      line,
      column,
      error: `Required property ${params.missingProperty} is missing`,
    };
  }
}
