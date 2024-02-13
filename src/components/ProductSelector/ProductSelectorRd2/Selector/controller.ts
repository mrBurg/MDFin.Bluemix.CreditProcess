import each from 'lodash/each';
import eachRight from 'lodash/eachRight';
import reduce from 'lodash/reduce';
import reduceRight from 'lodash/reduceRight';
import size from 'lodash/size';
import { toJS } from 'mobx';

import { TERM_FRACTION } from '@src/constants';
import { TSegment } from './@types';
import { TJSON } from '@interfaces';
import { TSegments } from '@stores-types/loanStore';

import cfg from './props.json';

export class AmountController {
  private props;
  private segments = [] as TSegment[];

  constructor(props: TSegments[]) {
    this.props = props;
  }

  getProps(amount: number) {
    const segments = [] as TSegment[];
    const firstSegment = this.props[0];
    const step = 1;
    const min = firstSegment.min / firstSegment.step;
    const marks = {
      [min]: (cfg.amountMarks as TJSON)[firstSegment.min],
    };
    const max = reduce(
      this.props,
      (accum, segment, index) => {
        const { max, step } = segment;
        let { min } = segment;

        if (!index) {
          min = 0;
        }

        const divisions = (max - min) / step;
        const segmentSize = accum + divisions;

        segments.push({
          min,
          max,
          step,
          divisions,
          segmentSize,
        });

        accum += divisions;
        (marks as TJSON)[accum] = (cfg.amountMarks as TJSON)[max];

        return accum;
      },
      0
    );

    this.segments = segments;

    return {
      marks,
      min,
      max,
      step,
      segments,
      divider: this.getDivider(amount),
    };
  }

  getValue(data: number) {
    let lastResult = 0;

    const step = reduceRight(
      this.segments,
      (accum, segment) => {
        const { step, segmentSize } = segment;

        return data <= segmentSize ? step : accum;
      },
      this.segments[0].step
    );

    const divider = reduce(
      this.segments,
      (accum, segment) => {
        const { segmentSize, max, divisions } = segment;

        if (data > segmentSize) {
          lastResult = max;
          accum -= divisions;
        }

        return accum;
      },
      data
    );

    return lastResult + step * divider;
  }

  private getDivider(data: number) {
    let dividerSize = 0;

    const divider = reduce(
      this.segments,
      (accum, segment) => {
        const { min, max, step, divisions } = segment;

        if (data > max) {
          dividerSize += divisions;
        }

        if (data > min) {
          return (data - min) / step;
        }

        return accum;
      },
      0
    );

    return dividerSize + divider;
  }
}

export class TermController {
  private props = [] as TSegments[];
  private collectedProps = [] as TSegments[];
  private segments = [] as TSegment[];
  private termMarks = {} as TJSON;
  private termFraction = TERM_FRACTION.DAY;

  constructor(props: TSegments[], termFraction: TERM_FRACTION) {
    this.props = props;
    this.termFraction = termFraction;

    if (size(this.props)) {
      this.prepareProps();
    }
  }

  private prepareProps() {
    const { min } = this.props[0];
    const [firstTermMarksData, ...termMarksData] = Object.values(cfg.termMarks);

    this.termMarks = {
      [min]: firstTermMarksData,
    };

    each(this.props, (item, index) => {
      const itemData = toJS(item);

      if (index) {
        itemData.min = itemData.max = cfg.segmentsSize[index];
      }

      this.collectedProps.push(itemData);
      this.termMarks[itemData.max] = termMarksData[index];
    });
  }

  getProps(term: number) {
    if (!size(this.collectedProps)) {
      return {};
    }

    const segments = [] as TSegment[];
    const firstSegment = this.collectedProps[0];
    const step = 1;
    const min = firstSegment.min;
    const marks = this.termMarks;
    /* const marks = {
      [min]: (termMarks as TJSON)[firstSegment.min],
    }; */
    let prevSegment = firstSegment;
    const max = reduce(
      this.collectedProps,
      (accum, segment, index) => {
        const { max, termFraction, min } = segment;
        let { step } = segment;

        step = step || firstSegment.min;

        /* const { termFraction, min } = segment;
        let { max, step } = segment;
        const currentDate = moment();

        switch (termFraction) {
          case TERM_FRACTION.DAY:
            step = step || firstSegment.min;
            break;
          case TERM_FRACTION.MONTH:
            max = moment(currentDate)
              .add(segment.max, TERM_FRACTION.MONTH)
              .diff(currentDate, 'days');
            step = max / segment.max;
            break;
        } */

        let divisions = max;

        if (index) {
          divisions = max - prevSegment.max;
          prevSegment = segment;
        }

        const segmentSize = accum + divisions;

        segments.push({
          min,
          max,
          step,
          divisions,
          segmentSize,
          termFraction,
        });

        accum += divisions;

        (marks as TJSON)[accum] = (this.termMarks as TJSON)[accum] || {
          label: `[${accum} luni]`,
        };
        /* (marks as TJSON)[accum] = (termMarks as TJSON)[accum] || {
          label: `${accum} luni`,
        }; */

        return accum;
      },
      0
    );

    this.segments = segments;

    return {
      marks,
      min,
      max,
      step,
      segments,
      divider: this.getDivider(term),
    };
  }

  getValue(data: number) {
    let result = data;

    eachRight(this.segments, (segment, index) => {
      const { min, max, divisions, termFraction, segmentSize } = segment;

      switch (true) {
        case data > max - divisions && termFraction == TERM_FRACTION.MONTH:
        case data > max - divisions &&
          termFraction == TERM_FRACTION.DAY &&
          min == segmentSize:
          result = this.props[index].min;
          // result = min;

          return false;
      }
    });

    return result;
  }

  getDivider(data: number) {
    let result = data;

    eachRight(this.props, (segment, index) => {
      const { min } = segment;

      switch (true) {
        case data >= min && this.termFraction == TERM_FRACTION.MONTH:
        case data == min:
          result = this.collectedProps[index].min;

          return false;
      }
    });
    /* eachRight(this.segments, (segment) => {
      const { min, max, divisions } = segment;

      if (data > min - divisions && fraction == TERM_FRACTION.MONTH) {
        result = max;

        return false;
      }
    }); */

    return result;
  }

  getFraction(data: number) {
    let fraction = TERM_FRACTION.DAY;
    const maxDays = reduce(
      this.segments,
      (accum, segment) => {
        const { termFraction, divisions } = segment;

        if (termFraction == TERM_FRACTION.DAY) {
          accum += divisions;
        }

        return accum;
      },
      0
    );

    if (data > maxDays) {
      fraction = TERM_FRACTION.MONTH;
    }

    return fraction;
  }
}
