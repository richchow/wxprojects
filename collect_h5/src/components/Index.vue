<template>
<div>
    <div id="container"></div>
    <div class="goe_title"  v-if="goelist.length > 0">选择采集点</div>
    <div id="list" v-if="goelist.length > 0">
      <div class="goeitem" v-for="(item, index) in goelist" :key="item.id" v-on:click="clToCollect(item.name, item.address, item.category, item.latLng)">
        <div class="goeitem_index">{{index + 1}}</div>
        <div class="goeitem_name">
          <div>{{ item.name }}[{{item.address}}]</div>
          <div class="goeitem_cate">{{item.category}}</div>
        </div>
        
      </div>
      <div class="goeitem_z"  v-on:click="clToCollect(' ', ' ', ' ', currLatLng)">
        <div class="goeitem_index">&nbsp;</div>
        <div class="goeitem_name">
          <div>自定义采集点</div>
        </div>
        
      </div>
    </div>
</div>
</template>

<script>
import { TMap } from "../TMap";
export default {
  name: "Index",
  data() {
    return {
      goelist: [],
      currLatLng: {}
    };
  },
  mounted() {
    TMap("MVZBZ-RQFWR-DHLWU-WWRRM-2DBMH-MTFIY").then(qq => {
      var geolocation = new qq.maps.Geolocation(
        "MVZBZ-RQFWR-DHLWU-WWRRM-2DBMH-MTFIY",
        "AIBServices"
      );
      geolocation.getLocation(this.showPosition, this.showErr);
    });
  },
  methods: {
    showPosition: function(position) {
      let that = this;
      let center = new qq.maps.LatLng(position.lat, position.lng);
      var map = new qq.maps.Map(document.getElementById("container"), {
        // 地图的中心地理坐标。
        center: center,
        zoom: 18,
        panControl:false,
        zoomControl:false,
        mapTypeControl:false,
      });
      var marker = new qq.maps.Marker({
        position: center,
        map: map
      });
      var geocoder = new qq.maps.Geocoder();
      geocoder.getAddress(center);
        geocoder.setComplete(function(result) {
          console.log("result:", result.detail);
          that.goelist = result.detail.nearPois;
          that.currLatLng = center;
        });
      qq.maps.event.addListener(map, "click", function(event) {
        let clickPiont = new qq.maps.LatLng(
          event.latLng.getLat(),
          event.latLng.getLng()
        );
        map.panTo(clickPiont);
        geocoder.getAddress(clickPiont);
        geocoder.setComplete(function(result) {
          console.log("result:", result.detail);
          that.goelist = result.detail.nearPois;
          that.currLatLng = clickPiont;
        });
        marker.setPosition(clickPiont);
        marker.setMap(map);
      });
    },
    showErr: function() {},
    clToCollect:function(name, address,category,latLng ){
      let ll = latLng.lat + ',' + latLng.lng;
      this.$router.push({name:'Collect',params:{name:name,address:address,category:category,latLng:ll}})
    }
  },
  created: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  width: 100%;
  height: 300px;
  display: table;
}
#list {
  width: 100%;
  height: auto;
  font-size: 12px;
}
.goeitem {
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #cdcdcd;
  padding:5px 0;
}
.goeitem_z{
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #cdcdcd;
  padding:10px 0;
}
.geoitem div {
  flex: 1;
}
.goeitem_index {
  width: 10%;
  text-align: center;
  margin:auto 0;
}
.goeitem_name {
  width: 90%;
  text-align: left;
}
.goe_title{
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #1296db;
  font-size: 14px;
  color: #fff;
  padding-left: 10px;
  text-align: left;
  font-weight: 700;
}
</style>
