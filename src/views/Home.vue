<template>
  <div>
    <br />
    <div class="container">
      <div class="columns is-full is-vcentered is-centered">
        <section>
        <strong>Contract Address:</strong> <a href="https://etherscan.io/token/0xbd3531da5cf5857e7cfaa92426877b022e612cf8" target="_blank"> {{contractAddress}}</a>
          <b-field label="Wallet address">
              <b-input v-model="walletAddress" :disabled="currentContract" style="width: 500px"></b-input>
          </b-field>

          <div v-if="!currentContract">
            <b-button type="is-success" expanded @click="getNFTs">Load NFTs</b-button>
          </div>
        </section>
      </div>  
    </div>  

    <br>

    <div class="container">
      <strong>TOTAL:</strong> {{totalNFTs}}
        <b-notification class="is-primary" ref="nftCards" :closable="false">
          <div class="columns is-desktop is-multiline is-full is-vcentered is-centered">
            <p v-if="tokenMetadataList.length == 0">No data....</p>
            <div v-else class="column is-3" v-for="(metadata, index) in tokenMetadataList" :key="index">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by2">
                    <img :src="metadata.image" alt="Placeholder image">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4">{{metadata.name}}</p>
                      <p class="subtitle is-6">{{metadata.description}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-notification>
    </div>
  </div>
</template>

<script>
import PudgyPenguinsABI from '../utils/PudgyPenguinsABI.js'

export default {
  name: "Home",
  data() {
    return {
      walletAddress: "0x8694157ad12505792703749874c83c4f5c7b24ed",
      totalNFTs: 0,
      currentContract : null,
      contractAddress: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
      tokenMetadataList: []
    };
  },
  computed: {
    rpcProviderURL () {
      return process.env.VUE_APP_ALCHEMY_URL + process.env.VUE_APP_ALCHEMY_API_KEY 
    }
  },
  methods: {
    async getNFTs () {
      this.tokenMetadataList = []
      const loadingComponent = this.$buefy.loading.open({
          container: this.$refs.nftCards.$el
      })

      
      var provider = new this.$ethers.providers.JsonRpcProvider(this.rpcProviderURL);

      this.currentContract = new this.$ethers.Contract(this.contractAddress, PudgyPenguinsABI, provider);
      let balance = await this.currentContract.balanceOf(this.walletAddress)
      this.totalNFTs = balance.toNumber()
      let linksArr = []
      for (let i = 0; i < balance.toNumber(); i++) {
        let tokenId = await this.currentContract.tokenOfOwnerByIndex(this.walletAddress, i)
        let tokenMetadataURI = await this.currentContract.tokenURI(tokenId)
        console.log(tokenMetadataURI)
        if (tokenMetadataURI.startsWith("ipfs://")) {
          tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
          
        }

        linksArr.push(tokenMetadataURI)
      }

        try {
          let _this = this
          this.$http.all(linksArr.map(l => this.$http.get(l)))
            .then(this.$http.spread(function (...res) {
              res.forEach(e => {
                _this.tokenMetadataList.push(e.data)
              });
            }));
        } catch (err) {
            console.error(err);
        }

      loadingComponent.close()
      this.currentContract = null
    }
  },
};
</script>

<style lang="scss">
</style>
