import EarnedRewards from "./EarnedRewards"
import RewardRate from "./RewardRate"
import StakedAmount from "./StakedAmount"

const DisplayPanel = () => {
    return(
        <div>
            <StakedAmount/>
            <RewardRate/>
            <EarnedRewards/>
            
        </div>
    )
}
export default DisplayPanel;
