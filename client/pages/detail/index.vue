<template>
  <div>详情页</div>
</template>

<script>
import titleMixin from '@client/mixin/title-mixin';
import { test } from '@client/common';

console.log(test);

export default {
  mixins: [titleMixin],
  title () {
    return '详情页2';
  }
}
</script>
